// Ensiklopediýa: kitaby okamak, mazmuny we gözleg
window.App = window.App || {};
App.views = App.views || {};

App.views.encyclopedia = {
  render(el, params) {
    const U = App.util, st = App.store, s = st.state;
    const book = window.BOOK;
    const chapters = book.chapters;
    // #/encyclopedia/book:<id> — ulanyjynyň ýüklän kitabyny okamak
    const userBookId = params[0] && params[0].startsWith('book:') ? params[0].slice(5) : null;
    const ch = chapters.find(c => c.id === params[0]) || chapters.find(c => c.id === s.book.lastChapter) || chapters[0];
    const idx = chapters.indexOf(ch);
    if (!userBookId) {
      s.book.lastChapter = ch.id;
      st.save();
    }
    const urls = [];   // döredilen faýl salgylary (sahypadan çykanda boşadylýar)
    App.onLeave(() => urls.forEach(u => URL.revokeObjectURL(u)));

    // Abzasdaky `kod` böleklerini <code>, **galyň** tekstleri <b> görnüşine öwürmek
    const inline = t => U.esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

    const renderBlock = ([type, val]) => {
      if (type === 'h') return `<h3>${U.esc(val)}</h3>`;
      if (type === 'p') return `<p>${inline(val)}</p>`;
      if (type === 'code') return `<pre class="code">${U.esc(U.noSemi(val))}</pre>`;
      if (type === 'list') return `<ul>${val.map(i => `<li>${inline(i)}</li>`).join('')}</ul>`;
      if (type === 'tip') return `<div class="tip">💡 ${inline(val)}</div>`;
      return '';
    };

    const chapterText = c => (c.title + ' ' + c.blocks.map(b => Array.isArray(b[1]) ? b[1].join(' ') : b[1]).join(' ')).toLowerCase();
    const unit = window.LESSONS.find(u => u.chapter === ch.id);
    const firstLevel = unit && unit.levels[0];

    // "books" bukjasyndaky kitaplar (programma bilen gelýänler)
    const extra = window.EXTRA_BOOKS.map(b => `<a class="toc-item" href="${U.esc(b.file)}" target="_blank" rel="noopener">📕 ${U.esc(b.title)}<div class="muted small">${U.esc(b.author || '')}</div></a>`).join('');

    el.innerHTML = `
      <h1>📖 Ensiklopediýa</h1>
      <div class="book">
        <aside class="toc card">
          <div class="muted small">Kitap</div>
          <b>${U.esc(book.title)}</b>
          <input id="search" class="mt" placeholder="🔍 Gözleg...">
          <div id="tocList" class="mt">
            ${chapters.map(c => `<a class="toc-item ${c.id === ch.id ? 'active' : ''}" data-id="${c.id}" href="#/encyclopedia/${c.id}">${c.icon} ${U.esc(c.title)}</a>`).join('')}
          </div>
          <div id="noResult" class="muted small" hidden>Hiç zat tapylmady</div>
          <h4 class="mt">Goşmaça kitaplar</h4>
          <button class="btn full" id="bookUpload">📤 Kitap ýükle</button>
          <input type="file" id="bookFile" accept=".pdf,.txt,.md,.html,.json,.csv,.epub,.doc,.docx,application/pdf,text/plain" multiple hidden>
          <div class="muted small mt">PDF we tekst faýllary programmanyň içinde açylýar.</div>
          <div id="userBooks" class="mt"></div>
          ${extra}
        </aside>
        ${userBookId ? `<article class="chapter card" id="bookViewer"><div class="muted">⏳ Kitap açylýar...</div></article>` : `
        <article class="chapter card">
          <div class="muted small">${idx + 1} / ${chapters.length}-nji bap</div>
          <h2>${ch.icon} ${U.esc(ch.title)}</h2>
          <div class="chapter-body" lang="tk">${ch.blocks.map(renderBlock).join('')}</div>
          ${firstLevel ? `<div class="card soft mt">🎯 Bu baby okap bolduňyzmy? Bilimiňizi barlaň:
            <a class="btn primary" href="#/lesson/${firstLevel.id}">${U.esc(unit.title)} — sapaga geç</a></div>` : ''}
          <div class="row between mt">
            ${idx > 0 ? `<a class="btn" href="#/encyclopedia/${chapters[idx - 1].id}">◀ ${U.esc(chapters[idx - 1].title)}</a>` : '<span></span>'}
            ${idx < chapters.length - 1 ? `<a class="btn" href="#/encyclopedia/${chapters[idx + 1].id}">${U.esc(chapters[idx + 1].title)} ▶</a>` : ''}
          </div>
        </article>`}
      </div>`;
    if (userBookId) el.querySelectorAll('#tocList .toc-item').forEach(a => a.classList.remove('active'));

    // ---------- Ýüklenen kitaplar ----------
    const kindIcon = { pdf: '📕', text: '📄', other: '📦' };
    async function renderUserBooks() {
      const box = el.querySelector('#userBooks');
      if (!box) return;
      try {
        const list = await App.books.all();
        box.innerHTML = list.length ? list.map(b => `
          <div class="toc-item ubook ${b.id === userBookId ? 'active' : ''}">
            <a href="#/encyclopedia/book:${b.id}">${kindIcon[App.books.kind(b)]} ${U.esc(b.name)}
              <div class="muted small">${App.books.fmtSize(b.size)} · ${U.fmtDate(b.added)}</div></a>
            <button class="link small" data-del-book="${b.id}" title="Pozmak">✕</button>
          </div>`).join('')
          : (window.EXTRA_BOOKS.length ? '' : '<div class="muted small">Entek kitap ýüklenmedi.</div>');
        box.querySelectorAll('[data-del-book]').forEach(b => b.addEventListener('click', async () => {
          if (!(await U.confirm('Kitap pozulsynmy?', { title: '🗑 Kitaby pozmak', okText: 'Poz', danger: true }))) return;
          await App.books.remove(b.dataset.delBook);
          U.toast('Kitap pozuldy');
          if (b.dataset.delBook === userBookId) location.hash = '#/encyclopedia/' + ch.id;
          else renderUserBooks();
        }));
      } catch (e) {
        box.innerHTML = `<div class="muted small">Kitaplary açyp bolmady: ${U.esc(e.message)}</div>`;
      }
    }
    renderUserBooks();

    const fileInp = el.querySelector('#bookFile');
    el.querySelector('#bookUpload').addEventListener('click', () => fileInp.click());
    fileInp.addEventListener('change', async () => {
      const files = [...fileInp.files];
      if (!files.length) return;
      let last = null;
      for (const f of files) {
        if (f.size > 200 * 1048576) { U.toast(`"${f.name}" gaty uly (200 MB-dan köp)`); continue; }
        try { last = await App.books.add(f); } catch (e) { U.toast('Ýükläp bolmady: ' + e.message); }
      }
      fileInp.value = '';
      if (last) {
        U.toast(`📚 ${files.length > 1 ? files.length + ' kitap' : '"' + last.name + '"'} ýüklendi`);
        location.hash = '#/encyclopedia/book:' + last.id;
      }
    });

    // ---------- Kitaby okamak ----------
    async function showUserBook() {
      const view = el.querySelector('#bookViewer');
      const b = await App.books.get(userBookId).catch(() => null);
      if (!b) {
        view.innerHTML = `<h2>Kitap tapylmady</h2><p class="muted">Ol pozulan bolmagy mümkin.</p>
          <a class="btn" href="#/encyclopedia/${ch.id}">◀ Ensiklopediýa</a>`;
        return;
      }
      const url = URL.createObjectURL(b.blob);
      urls.push(url);
      const kind = App.books.kind(b);
      view.innerHTML = `
        <div class="row between wrap">
          <div><div class="muted small">Ýüklenen kitap · ${App.books.fmtSize(b.size)} · ${U.fmtDate(b.added)}</div>
            <h2>${kindIcon[kind]} ${U.esc(b.name)}</h2></div>
          <div class="row gap">
            <a class="btn" href="${url}" download="${U.esc(b.name)}">⬇ Göçürip al</a>
            <a class="btn" href="${url}" target="_blank" rel="noopener">↗ Täze penjirede</a>
          </div>
        </div>
        <div id="bookBody" class="mt"></div>`;
      const body = view.querySelector('#bookBody');
      if (kind === 'pdf') {
        body.innerHTML = `<iframe class="book-frame" src="${url}" title="${U.esc(b.name)}"></iframe>`;
      } else if (kind === 'text') {
        const text = await b.blob.text();
        body.innerHTML = `<pre class="book-text">${U.esc(text)}</pre>`;
      } else {
        body.innerHTML = `<div class="tip">💡 Bu faýl görnüşini programmanyň içinde açyp bolmaýar. "⬇ Göçürip al" düwmesi bilen kompýuteriňize alyp, degişli programma bilen açyň.</div>`;
      }
    }
    if (userBookId) showUserBook();

    // Mazmun boýunça gözleg
    const search = el.querySelector('#search');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      el.querySelectorAll('#tocList .toc-item').forEach(a => {
        const c = chapters.find(x => x.id === a.dataset.id);
        // Terjime edilen bap ady (rus / iňlis dili) boýunça hem gözlenýär
        const hit = !q || chapterText(c).includes(q) || a.textContent.toLowerCase().includes(q);
        a.hidden = !hit;
        if (hit) shown++;
      });
      el.querySelector('#noResult').hidden = shown > 0;
    });
  }
};
