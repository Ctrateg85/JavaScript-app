// Elýeterlilik (accessibility): ekran okaýjy programmalar (NVDA, JAWS, Narrator) we klawiatura bilen ulanmak üçin
//
//  * Ösüş zolaklary (.bar) — role="progressbar" we häzirki göterim.
//  * Diňe ikonkaly düwmeler — title-dan aria-label; ✓ / ✗ nokatlary — "dogry" / "ýalňyş".
//  * Saýlanýan wariantlar — aria-pressed; sapak, duel we mesele netijeleri — aria-live (üýtgeşme okalýar).
//  * Habarlar (toast) we sahypa çalşygy — gizlin "aria-live" meýdany arkaly okalýar.
//  * Penjireler (modal): ady (aria-labelledby), Tab bilen penjiräniň içinde aýlanmak, ýapylanda öňki ýere gaýtmak.
// Tekstler türkmen dilinde goýulýar — saýlanan dile js/i18n.js terjime edýär.
window.App = window.App || {};

App.a11y = (function () {
  const LIVE = '#feedback, #verdict, #results, #phase, .pb-text, #confirmHint, #clockState';
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  let liveBox = null, uid = 0;

  // Gizlin meýdan arkaly tekst okatmak
  function announce(text) {
    if (!liveBox || !text) return;
    liveBox.textContent = '';
    setTimeout(() => { liveBox.textContent = text; }, 60);
  }

  function enhance(el) {
    if (el.nodeType !== 1) return;
    const all = [el, ...el.querySelectorAll('*')];
    for (const n of all) {
      const c = n.classList;
      if (c.contains('bar')) progress(n);
      else if (c.contains('dot')) {
        if (c.contains('ok')) n.setAttribute('aria-label', 'dogry');
        else if (c.contains('bad')) n.setAttribute('aria-label', 'ýalňyş');
        else n.setAttribute('aria-hidden', 'true');
      } else if (c.contains('option') || c.contains('avatar-opt')) {
        n.setAttribute('aria-pressed', String(c.contains('selected')));
      } else if (c.contains('toast')) {
        announce(n.textContent);
      } else if (c.contains('modal-back')) {
        modal(n);
      }
      if (n.matches(LIVE) && !n.hasAttribute('aria-live')) n.setAttribute('aria-live', 'polite');
      if (n.tagName === 'IMG' && n.classList.contains('av-img')) n.setAttribute('alt', 'Profil suraty');
      if ((n.tagName === 'BUTTON' || n.tagName === 'A') && !n.hasAttribute('aria-label') && n.title && !/\p{L}{2}/u.test(n.textContent)) {
        n.setAttribute('aria-label', n.title);
      }
    }
  }

  // Zolagyň göterimi içindäki elementiň giňliginden (style="width: N%") alynýar
  function progress(bar) {
    const inner = bar.firstElementChild;
    const pct = inner ? Math.round(parseFloat(inner.style.width) || 0) : 0;
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(pct));
    if (!bar.hasAttribute('aria-label')) bar.setAttribute('aria-label', 'Ösüş');
  }

  // Penjire: ady, fokus penjiräniň içinde galýar, ýapylanda öňki elemente gaýdýar
  function modal(back) {
    if (back.__a11y) return;
    back.__a11y = true;
    const box = back.querySelector('.modal') || back;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    const h = box.querySelector('h1, h2, h3');
    if (h) { if (!h.id) h.id = 'dlg-title-' + (++uid); box.setAttribute('aria-labelledby', h.id); }
    const before = document.activeElement;
    back.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const items = [...box.querySelectorAll(FOCUSABLE)].filter(x => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Penjire DOM-dan aýrylanda ýa-da gizlenende fokus yzyna gaýtarylýar
    const watch = new MutationObserver(() => {
      if (!back.isConnected || back.hidden) {
        watch.disconnect();
        back.__a11y = !back.isConnected ? true : false;
        if (before && before.isConnected) before.focus();
      }
    });
    watch.observe(document.body, { childList: true });
    watch.observe(back, { attributes: true, attributeFilter: ['hidden'] });
  }

  // Sahypa çalşanda: fokus esasy meýdana geçýär we sahypanyň ady okalýar
  function pageChanged() {
    const view = document.getElementById('view');
    if (!view) return;
    const h = view.querySelector('h1, h2');
    if (document.activeElement && document.activeElement !== document.body && !view.contains(document.activeElement)
      && !document.activeElement.closest('.topbar, .corner-menu')) return;
    view.focus({ preventScroll: true });
    if (h) announce(h.textContent.trim());
  }

  function init() {
    liveBox = document.getElementById('srLive');
    const skip = document.getElementById('skipLink');
    if (skip) skip.addEventListener('click', () => document.getElementById('view').focus());
    enhance(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'childList') m.addedNodes.forEach(enhance);
      else {
        const t = m.target, c = t.classList;
        if (m.attributeName === 'style' && t.parentElement && t.parentElement.classList.contains('bar')) progress(t.parentElement);
        else if (m.attributeName === 'class' && (c.contains('option') || c.contains('avatar-opt'))) t.setAttribute('aria-pressed', String(c.contains('selected')));
        else if (m.attributeName === 'class' && c.contains('dot')) enhance(t);
      }
    })).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'] });
  }

  return { init, announce, pageChanged };
})();
