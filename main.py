"""JavaScript — iş stoly programmasy (Windows .exe üçin).

Programmany aýratyn penjirede (WebView2 / Edge) açýar. Maglumatlar (ösüş, sazlamalar, ýüklenen kitaplar)
her açylyşda saklanar ýaly:
  * sahypa hemişe şol bir salgyda açylýar: http://127.0.0.1:47821  (kiçijik ýerli serwer, internet gerek däl);
  * brauzer maglumatlary %APPDATA%\\JSOwren bukjasynda saklanýar.

Işletmek:   py main.py
.exe ýasamak: build.bat
"""
import email.utils
import functools
import http.server
import json
import os
import socket
import socketserver
import struct
import sys
import threading
import time
import urllib.request

import webview

import lan   # Lokal bölüm: ýerli tor arkaly ýaryş (0.0.0.0:47822)

APP_NAME = 'JavaScript'
PORT = 47821   # üýtgemeli däl: başga port — başga salga — öňki maglumatlar görünmez


def base_dir():
    """Programmanyň faýllarynyň bukjasy (.exe içinde PyInstaller ony wagtlaýyn bukja açýar)."""
    return getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))


def storage_dir():
    """Brauzer maglumatlarynyň (localStorage, IndexedDB) saklanýan ýeri."""
    path = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'JSOwren')   # köne at: öňki maglumatlar saklansyn
    os.makedirs(path, exist_ok=True)
    return path


NTP_SERVERS = ('time.google.com', 'pool.ntp.org', 'time.windows.com')
NTP_EPOCH = 2208988800   # 1900-01-01 bilen 1970-01-01 arasyndaky sekuntlar


def ntp_time():
    """NTP serwerinden takyk wagt (ms). Biri jogap bermese, indikisi synanyşylýar."""
    for host in NTP_SERVERS:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.settimeout(3)
                t0 = time.time()
                s.sendto(b'\x1b' + 47 * b'\0', (host, 123))
                data, _ = s.recvfrom(48)
                t1 = time.time()
            sec, frac = struct.unpack('!II', data[40:48])
            return int((sec - NTP_EPOCH + frac / 2 ** 32 + (t1 - t0) / 2) * 1000)
        except OSError:
            continue
    return None


def http_date_time():
    """NTP ýapyk bolsa: belli saýtyň HTTP "Date" sözbaşysyndan wagt (sekunt takyklygynda)."""
    for url in ('https://www.google.com/generate_204', 'https://www.microsoft.com'):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=4) as r:
                return int(email.utils.parsedate_to_datetime(r.headers['Date']).timestamp() * 1000)
        except Exception:
            continue
    return None


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Faýllary berýän serwer, konsola ýazgy çykarmaýar. /api/time — internetden alnan takyk wagt (clock.js üçin)."""
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/markdown'}

    def do_GET(self):
        if self.path.split('?')[0] != '/api/time':
            return super().do_GET()
        ms = ntp_time() or http_date_time()
        body = json.dumps({'unix_ms': ms} if ms else {'error': 'offline'}).encode()
        self.send_response(200 if ms else 503)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


def start_server():
    handler = functools.partial(QuietHandler, directory=base_dir())
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    try:
        start_server()
        lan.start()
    except OSError:
        # Port eýýäm meşgul: programma ikinji gezek açylan bolmagy mümkin
        webview.create_window(APP_NAME, html='<h2 style="font-family:sans-serif">JavaScript programmasy eýýäm açyk ýa-da 47821 port meşgul.</h2>'
                              '<p style="font-family:sans-serif">Öňki penjiräni ýapyp, täzeden synanyşyň.</p>', width=520, height=220)
        webview.start()
        return
    width, height, min_size, maximized = window_geometry()
    webview.create_window(APP_NAME, f'http://127.0.0.1:{PORT}/index.html', width=width, height=height,
                          min_size=min_size, maximized=maximized)
    webview.start(private_mode=False, storage_path=storage_dir())


def window_geometry():
    """Penjiräniň ölçegi ekrana görä: başga kompýuterde (kiçi ekran, Windows 125–150 % ulaltma) penjire ekrandan çykmasyn.
    Kiçi ekranlarda programma doly ekranda (maximized) açylýar."""
    sw, sh = 1366, 768
    try:
        screen = webview.screens[0]
        sw, sh = screen.width, screen.height
    except Exception:
        pass
    width, height = min(1280, int(sw * 0.9)), min(840, int(sh * 0.88))
    min_size = (min(640, width), min(480, height))
    return width, height, min_size, sw < 1200 or sh < 720


if __name__ == '__main__':
    main()
