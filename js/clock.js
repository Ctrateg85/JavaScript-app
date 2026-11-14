// Dünýä (internet) wagty: janlar, yzygiderlik, hepdelik liga we beýleki wagt düzgünleri kompýuteriň sagadyna däl-de,
// internetden alnan takyk wagta bagly.
//
//  * Programma açylanda we her 30 minutda internetdäki wagt hyzmatlaryndan UTC wagty alynýar
//    we kompýuteriň sagady bilen tapawut (offset) hasaplanýar: App.clock.now() = Date.now() + offset.
//  * Tapawut localStorage-da saklanýar: internet ýok bolsa, soňky belli tapawut ulanylýar.
//  * Wagt hiç haçan yza gitmeýär: sagat yza süýşürilse-de, iň soňky görlen wagtdan kiçi baha gaýtarylmaýar.
//  * Senäniň çäkleri (gün, hepde) ulanyjynyň ýerli sagat guşagyna görä kesgitlenýär.
window.App = window.App || {};

App.clock = (function () {
  const KEY = 'jsOwren_clock_v1';
  const RESYNC_MS = 30 * 60000;
  // Wagt hyzmatlary (CORS rugsatly): biri işlemese, indikisi synanyşylýar.
  // .exe görnüşinde (main.py, http://127.0.0.1) ilki programmanyň öz serweri: ol wagty NTP serwerlerinden alýar.
  const SOURCES = [
    ...(location.protocol.startsWith('http') ? [{ url: '/api/time', parse: j => j.unix_ms, name: 'NTP' }] : []),
    { url: 'https://worldtimeapi.org/api/timezone/Etc/UTC', parse: j => Date.parse(j.utc_datetime) },
    { url: 'https://timeapi.io/api/Time/current/zone?timeZone=UTC', parse: j => Date.parse(j.dateTime.replace(/(\.\d{3})\d*/, '$1') + 'Z') },
    { url: 'https://www.timeapi.io/api/v1/time/current/unix', parse: j => j.unix_timestamp * 1000 }
  ];

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

  const clock = {
    offset: Number(saved.offset) || 0,   // internet wagty − kompýuteriň wagty (ms)
    source: saved.source || null,        // soňky gezek haýsy hyzmatdan alyndy
    syncedAt: saved.syncedAt || null,    // soňky üstünlikli sinhronlaşdyrma (internet wagty bilen)
    online: false,                       // şu gezek internetden alyndymy
    lastSeen: Number(saved.lastSeen) || 0,

    now() {
      const t = Math.max(Date.now() + this.offset, this.lastSeen);
      this.lastSeen = t;
      return t;
    },

    date() { return new Date(this.now()); },

    save() {
      try {
        localStorage.setItem(KEY, JSON.stringify({ offset: this.offset, source: this.source, syncedAt: this.syncedAt, lastSeen: this.lastSeen }));
      } catch (e) { /* saklap bolmady */ }
    },

    // Internet wagtyny almak. Gaýtarýar: true — üstünlikli, false — internet ýok / hyzmatlar jogap bermedi
    async sync() {
      for (const src of SOURCES) {
        try {
          const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timer = setTimeout(() => ctrl && ctrl.abort(), 5000);
          const t0 = Date.now();
          const res = await fetch(src.url, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined });
          const json = await res.json();
          clearTimeout(timer);
          const t1 = Date.now();
          const server = src.parse(json);
          if (!res.ok || !isFinite(server)) continue;
          // Jogabyň ýoldaky wagtynyň ýarysy goşulýar
          this.offset = Math.round(server + (t1 - t0) / 2 - t1);
          this.source = src.name || new URL(src.url).hostname;
          this.online = true;
          // Sagat öňe süýşürilip, soňra düzedilen bolsa, lastSeen hakyky wagtdan öňde galmaz ýaly
          this.lastSeen = Math.min(this.lastSeen, Date.now() + this.offset);
          this.syncedAt = this.now();
          this.save();
          return true;
        } catch (e) { /* indiki hyzmat */ }
      }
      this.online = false;
      this.save();
      return false;
    },

    // Sinhronlaşdyrmany başlatmak; wagt ep-esli üýtgese onChange(diff) çagyrylýar
    start(onChange) {
      const run = async () => {
        const before = this.now();
        if (await this.sync() && onChange) {
          const diff = this.now() - before;
          if (Math.abs(diff) > 60000) onChange(diff);
        }
      };
      run();
      setInterval(run, RESYNC_MS);
      window.addEventListener('online', run);
      window.addEventListener('beforeunload', () => this.save());
    }
  };
  return clock;
})();
