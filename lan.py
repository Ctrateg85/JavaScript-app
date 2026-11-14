"""JavaScript — Lokal bölüm: ýerli tor (Wi-Fi / LAN) arkaly adamlar bilen ýaryşmak.

Gurluşy:
  * Her programma 0.0.0.0:47822 portunda kiçi oýun serwerini açýar (HTTP + JSON, CORS rugsatly).
  * Oýun döreden (host) kompýuter otagy öz serwerinde saklaýar we her 1.5 sekuntda ýerli tora
    UDP yglanyny iberýär (47823 port). Beýleki programmalar bu yglanlary diňläp, otaglaryň sanawyny görkezýär.
  * Oýunçylar host-yň serwerine göni ýüzlenýär: goşulmak, ýagdaýy almak (her 0.4 s), jogap ibermek.
  * Wagt we ballar diňe host-yň serwerinde hasaplanýar — hemmeler üçin deň.

Hostuň dolandyryş buýruklary (otag döretmek, başlamak, ýapmak) diňe şol kompýuterden (127.0.0.1) kabul edilýär.
"""
import http.server
import json
import math
import secrets
import socket
import socketserver
import threading
import time

LAN_PORT = 47822
UDP_PORT = 47823
MAGIC = 'JSOWREN1'
MAX_PLAYERS = 8
REVEAL_SEC = 4          # tapgyryň netijesi näçe sekunt görkezilýär
ANNOUNCE_SEC = 1.5
HOST_TTL = 5            # yglan näçe sekunt täze hasaplanýar

_lock = threading.Lock()
_room = None            # host-yň otagy (bu kompýuterde döredilen bolsa)
_hosts = {}             # ip → tapylan otag {title, players, status, port, seen}


def now_ms():
    return int(time.time() * 1000)


def my_ips():
    """Bu kompýuteriň ýerli tordaky IP salgylary."""
    ips = set()
    try:
        ips.update(socket.gethostbyname_ex(socket.gethostname())[2])
    except OSError:
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(('10.255.255.255', 1))   # paket iberilmeýär — diňe çykyş salgysy kesgitlenýär
            ips.add(s.getsockname()[0])
    except OSError:
        pass
    return sorted(ip for ip in ips if not ip.startswith('127.'))


def clean(text, limit):
    return str(text or '').strip()[:limit]


# ---------- Otag (oýun) ----------

def new_room(data):
    questions = []
    for q in (data.get('questions') or [])[:20]:
        opts = [clean(o, 300) for o in (q.get('options') or [])][:6]
        ans = q.get('answer')
        if len(opts) >= 2 and isinstance(ans, int) and 0 <= ans < len(opts):
            questions.append({'q': clean(q.get('q'), 500), 'code': clean(q.get('code'), 2000), 'options': opts, 'answer': ans})
    if not questions:
        raise ValueError('Sorag ýok')
    return {
        'id': secrets.token_hex(4),
        'title': clean(data.get('title'), 40) or 'JavaScript',
        'roundSec': max(5, min(60, int(data.get('roundSec') or 15))),
        'questions': questions,
        'status': 'lobby',      # lobby → playing → reveal → ... → finished
        'round': 0,
        'roundStart': 0,
        'revealUntil': 0,
        'players': {},          # pid → {token, name, avatar, score, answers: {round: {choice, t}}, left, host}
        'order': [],
        'results': [],          # her tapgyryň netijesi
    }


def add_player(room, name, avatar, host=False):
    active = [p for p in room['players'].values() if not p['left']]
    if len(active) >= MAX_PLAYERS:
        raise ValueError('Otag doly')
    if room['status'] != 'lobby':
        raise ValueError('Oýun eýýäm başlandy')
    pid = 'h' if host else secrets.token_hex(3)
    token = secrets.token_hex(12)
    room['players'][pid] = {'token': token, 'name': clean(name, 20) or 'Oýunçy', 'avatar': clean(avatar, 8) or '🙂',
                            'score': 0, 'answers': {}, 'left': False, 'host': host}
    room['order'].append(pid)
    return pid, token


def tick(room):
    """Wagta görä ýagdaýy öňe sürmek (her soragda çagyrylýar)."""
    t = now_ms()
    if room['status'] == 'playing':
        r = room['round']
        active = [p for p in room['players'].values() if not p['left']]
        all_done = active and all(str(r) in p['answers'] for p in active)
        if all_done or t >= room['roundStart'] + room['roundSec'] * 1000:
            finish_round(room)
    elif room['status'] == 'reveal' and t >= room['revealUntil']:
        room['round'] += 1
        if room['round'] >= len(room['questions']):
            room['status'] = 'finished'
        else:
            room['status'] = 'playing'
            room['roundStart'] = now_ms()


def finish_round(room):
    r = room['round']
    q = room['questions'][r]
    res = {}
    for pid, p in room['players'].items():
        a = p['answers'].get(str(r))
        ok = bool(a) and a['choice'] == q['answer']
        pts = 0
        if ok:
            left = max(0, room['roundSec'] - a['t'] / 1000)
            pts = 10 + min(5, math.ceil(left / 3))
            p['score'] += pts
        res[pid] = {'choice': a['choice'] if a else None, 't': a['t'] if a else None, 'ok': ok, 'pts': pts}
    room['results'].append(res)
    room['status'] = 'reveal'
    room['revealUntil'] = now_ms() + REVEAL_SEC * 1000


def public_state(room, pid):
    """Oýunça iberilýän ýagdaý: tokenler we entek gutarmadyk tapgyryň dogry jogaby görkezilmeýär."""
    r = room['round']
    st = room['status']
    players = []
    for k in room['order']:
        p = room['players'][k]
        players.append({'pid': k, 'name': p['name'], 'avatar': p['avatar'], 'score': p['score'], 'left': p['left'],
                        'host': p['host'], 'answered': str(r) in p['answers'] if st == 'playing' else False})
    out = {'id': room['id'], 'title': room['title'], 'status': st, 'round': r, 'total': len(room['questions']),
           'roundSec': room['roundSec'], 'players': players, 'me': pid, 'serverNow': now_ms()}
    if st in ('playing', 'reveal') and r < len(room['questions']):
        q = room['questions'][r]
        out['question'] = {'q': q['q'], 'code': q['code'], 'options': q['options']}
        out['remainingMs'] = max(0, room['roundStart'] + room['roundSec'] * 1000 - now_ms()) if st == 'playing' else 0
        mine = room['players'].get(pid, {}).get('answers', {}).get(str(r))
        out['myChoice'] = mine['choice'] if mine else None
    if st == 'reveal':
        out['answer'] = room['questions'][r]['answer']
        out['result'] = room['results'][r]
        out['revealMs'] = max(0, room['revealUntil'] - now_ms())
    if st == 'finished':
        out['results'] = room['results']
        out['questions'] = [{'q': q['q'], 'options': q['options'], 'answer': q['answer']} for q in room['questions']]
    return out


# ---------- HTTP serwer ----------

class LanHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n > 1_000_000:
            raise ValueError('Gaty uly')
        return json.loads(self.rfile.read(n) or b'{}') if n else {}

    def _local(self):
        return self.client_address[0] in ('127.0.0.1', '::1')

    def _auth(self, room, data):
        p = room['players'].get(str(data.get('pid')))
        if not p or not secrets.compare_digest(p['token'], str(data.get('token') or '')):
            raise PermissionError('Oýunçy tapylmady')
        return p

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        path, _, query = self.path.partition('?')
        params = dict(kv.split('=', 1) for kv in query.split('&') if '=' in kv)
        global _room
        with _lock:
            if path == '/lan/info':
                room = _room
                return self._send(200, {'app': MAGIC, 'room': room and {'id': room['id'], 'title': room['title'], 'status': room['status'],
                                                                  'players': sum(not p['left'] for p in room['players'].values())}})
            if path == '/lan/state':
                if not _room:
                    return self._send(404, {'error': 'Otag ýapyldy'})
                tick(_room)
                p = _room['players'].get(params.get('pid', ''))
                if not p or not secrets.compare_digest(p['token'], params.get('token', '')):
                    return self._send(403, {'error': 'Oýunçy tapylmady'})
                return self._send(200, public_state(_room, params.get('pid')))
            if path == '/lan/hosts' and self._local():
                t = time.time()
                hosts = [dict(ip=ip, **h) for ip, h in _hosts.items() if t - h['seen'] < HOST_TTL]
                return self._send(200, {'hosts': hosts, 'myIps': my_ips(), 'port': LAN_PORT})
        self._send(404, {'error': 'Tapylmady'})

    def do_POST(self):
        global _room
        try:
            data = self._body()
            with _lock:
                path = self.path.split('?')[0]
                if path == '/lan/host':
                    if not self._local():
                        raise PermissionError('Diňe öz kompýuteriňizden')
                    _room = new_room(data)
                    pid, token = add_player(_room, data.get('name'), data.get('avatar'), host=True)
                    return self._send(200, {'pid': pid, 'token': token, 'id': _room['id']})
                if not _room:
                    return self._send(404, {'error': 'Otag ýapyldy'})
                if path == '/lan/join':
                    pid, token = add_player(_room, data.get('name'), data.get('avatar'))
                    return self._send(200, {'pid': pid, 'token': token, 'id': _room['id'], 'title': _room['title']})
                p = self._auth(_room, data)
                tick(_room)
                if path == '/lan/answer':
                    r = _room['round']
                    if _room['status'] == 'playing' and int(data.get('round', -1)) == r and str(r) not in p['answers']:
                        choice = int(data.get('choice'))
                        if 0 <= choice < len(_room['questions'][r]['options']):
                            p['answers'][str(r)] = {'choice': choice, 't': now_ms() - _room['roundStart']}
                            tick(_room)
                    return self._send(200, {'ok': True})
                if path == '/lan/leave':
                    p['left'] = True
                    return self._send(200, {'ok': True})
                if path in ('/lan/start', '/lan/close') and not (self._local() and p['host']):
                    raise PermissionError('Diňe otagy dörediji')
                if path == '/lan/start':
                    if sum(not x['left'] for x in _room['players'].values()) < 2:
                        raise ValueError('Iň az 2 oýunçy gerek')
                    if _room['status'] == 'lobby':
                        _room['status'] = 'playing'
                        _room['roundStart'] = now_ms()
                    return self._send(200, {'ok': True})
                if path == '/lan/close':
                    _room = None
                    return self._send(200, {'ok': True})
            self._send(404, {'error': 'Tapylmady'})
        except PermissionError as e:
            self._send(403, {'error': str(e)})
        except (ValueError, TypeError, json.JSONDecodeError) as e:
            self._send(400, {'error': str(e)})


# ---------- UDP: otaglary yglan etmek we tapmak ----------

def _announcer():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        while True:
            with _lock:
                room = _room
                msg = room and json.dumps({'m': MAGIC, 'title': room['title'], 'status': room['status'], 'port': LAN_PORT,
                                           'players': sum(not p['left'] for p in room['players'].values())})
            if msg:
                try:
                    s.sendto(msg.encode('utf-8'), ('255.255.255.255', UDP_PORT))
                except OSError:
                    pass
            time.sleep(ANNOUNCE_SEC)


def _listener():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        s.bind(('', UDP_PORT))
    except OSError:
        return   # port meşgul: otaglar diňe IP salgy bilen tapylýar
    while True:
        try:
            data, (ip, _) = s.recvfrom(4096)
            info = json.loads(data.decode('utf-8'))
            if info.get('m') != MAGIC:
                continue
            with _lock:
                _hosts[ip] = {'title': clean(info.get('title'), 40), 'status': clean(info.get('status'), 10),
                              'players': int(info.get('players') or 0), 'port': int(info.get('port') or LAN_PORT), 'seen': time.time()}
        except (OSError, ValueError):
            continue


class _Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = False   # Windows-da başga programma şol porty eýelän bolsa, ikinji gezek açylmasyn
    daemon_threads = True


def start():
    """Lokal serweri we UDP yglan/diňleýjini işe girizmek. Port meşgul bolsa False."""
    try:
        httpd = _Server(('0.0.0.0', LAN_PORT), LanHandler)
    except OSError:
        return False
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    threading.Thread(target=_announcer, daemon=True).start()
    threading.Thread(target=_listener, daemon=True).start()
    return True
