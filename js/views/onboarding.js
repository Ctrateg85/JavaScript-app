// Ilkinji gezek açylanda: ady we awatary saýlamak
window.App = window.App || {};
App.views = App.views || {};

App.AVATARS = ['🦊', '🐱', '🐧', '🎓', '🐻', '🐼', '🐯', '🦉', '🐬', '🚀', '🤖', '🧠', '🌟', '🐉', '🦄', '🎯'];

// Ulanyjynyň awatary: ýüklenen surat bar bolsa surat, ýogsam emoji
App.avatarHtml = function (user) {
  return user.photo
    ? `<img class="av-img" src="${App.util.esc(user.photo)}" alt="">`
    : App.util.esc(user.avatar);
};

// Ýüklenen suraty 256×256 inedördül görnüşe kiçeldip, data URL gaýtarýar
App.readPhoto = function (file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error('Surat faýly däl'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Faýly okap bolmady'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Suraty açyp bolmady'));
      img.onload = () => {
        const size = 256, side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
};

App.avatarPicker = function (selected) {
  return `<div class="avatar-grid">${App.AVATARS.map(a =>
    `<button type="button" class="avatar-opt ${a === selected ? 'selected' : ''}" data-avatar="${a}">${a}</button>`
  ).join('')}</div>`;
};

App.bindAvatarPicker = function (root, onPick) {
  root.querySelectorAll('.avatar-opt').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
    onPick(b.dataset.avatar);
  }));
};

App.views.onboarding = {
  render(el) {
    const s = App.store.state;
    let avatar = s.user.avatar;
    el.innerHTML = `
      <div class="card narrow center">
        <div class="row center mb">${App.i18n.picker()}</div>
        <h1>⚡ JavaScript</h1>
        <p class="muted">JavaScript-i dereje-dereje öwreniň, bilimiňizi barlaň we beýlekiler bilen bäsleşiň.</p>
        <form id="obForm" class="form">
          <label>Adyňyz
            <input id="obName" maxlength="20" placeholder="Meselem: Merdan" required autofocus>
          </label>
          <label>Awatar saýlaň</label>
          ${App.avatarPicker(avatar)}
          <button class="btn primary big" type="submit">Başla 🚀</button>
        </form>
      </div>`;
    App.bindAvatarPicker(el, a => { avatar = a; });
    App.i18n.bindPicker(el);
    el.querySelector('#obForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = el.querySelector('#obName').value.trim();
      if (!name) return;
      s.user.name = name;
      s.user.avatar = avatar;
      s.user.createdAt = App.clock.now();
      App.store.save();
      location.hash = '#/home';
      App.render();
    });
  }
};
