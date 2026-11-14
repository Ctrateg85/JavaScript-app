// Ulanyjynyň ýükleýän kitaplary (PDF, TXT ...): brauzeriň IndexedDB bazasynda saklanýar.
// localStorage diňe setir we ~5 MB saklap bilýär, IndexedDB bolsa uly faýllary (Blob) saklaýar.
window.App = window.App || {};

App.books = (function () {
  const DB_NAME = 'jsOwrenBooks', STORE = 'books';
  let dbPromise = null;

  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) return reject(new Error('Bu brauzer IndexedDB-ni goldamaýar'));
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  // Bir amaly ýerine ýetirip, netijesini Promise görnüşinde gaýtarmak
  async function run(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  return {
    // Ähli kitaplar (täzeden köne tertipde)
    async all() {
      const list = await run('readonly', s => s.getAll());
      return (list || []).sort((a, b) => b.added - a.added);
    },
    get(id) { return run('readonly', s => s.get(id)); },
    async add(file) {
      const book = {
        id: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: file.name, type: file.type || '', size: file.size, added: App.clock.now(), blob: file
      };
      await run('readwrite', s => s.put(book));
      return book;
    },
    remove(id) { return run('readwrite', s => s.delete(id)); },

    // Faýlyň görnüşi: pdf, text ýa-da other
    kind(book) {
      const n = book.name.toLowerCase();
      if (book.type === 'application/pdf' || n.endsWith('.pdf')) return 'pdf';
      if (/^text\//.test(book.type) || /\.(txt|md|js|json|html|css|csv)$/.test(n)) return 'text';
      return 'other';
    },

    fmtSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
  };
})();
