// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Close sidebar when clicking on overlay
document.getElementById('overlay')?.addEventListener('click', toggleSidebar);

// Close sidebar with ESC key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  }
});

function adminLogin(e) {
  e.preventDefault();

  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  // Daftar admin dengan username dan password
  const admins = {
    'Yunus': 'nianabila20',
    'fadilpenjahat': 'mamat',
    'alif': 'pmiirayon'
  };

  if (admins[username] && admins[username] === password) {
    localStorage.setItem('isAdmin', 'true');
    window.location.href = 'index.html';
  } else {
    errorMsg.innerText = 'Username atau password salah!';
  }
}

function userLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  // Daftar user dengan username dan password
  const users = {
    'user': 'user',
    'andi': 'andi123',
    'rani': 'rani456'
  };

  if (users[username] && users[username] === password) {
    localStorage.setItem('isUser', 'true');
    window.location.href = 'index.html';
  } else {
    errorMsg.textContent = 'Username atau password salah!';
  }
}

// Berita di halaman index.html (home)
const beritaGrid = document.getElementById('homeBeritaGrid');

function renderHomeBerita() {
  const list = JSON.parse(localStorage.getItem('beritaList') || '[]');
  const recent = list.slice(0,4);
  beritaGrid.innerHTML = '';

  recent.forEach(berita => {
    const link = document.createElement('a');
    link.href = `berita_detail.html?id=${berita.id}`;
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${berita.gambar}" class="news-image" style="height:120px;object-fit:cover;" />
      <div class="news-footer">
        <div style="font-weight:bold;">${berita.judul}</div>
        <div style="font-size:13px;">${berita.deskripsi}</div>
      </div>`;
    link.appendChild(card);
    beritaGrid.appendChild(link);
  });
}

if (beritaGrid) renderHomeBerita();

// Logic umum untuk semua halaman
window.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isUser = localStorage.getItem('isUser') === 'true';

  const logoutBtn = document.getElementById('logout-btn');
  const adminPanel = document.getElementById('menu-admin-panel');
  const obrolan = document.getElementById('menu-ruang-diskusi');
  const obrolanDot = document.getElementById('dot-ruang-diskusi');

  if ((isAdmin || isUser) && logoutBtn) {
    logoutBtn.style.display = 'inline-block';
  }

  if (isAdmin && adminPanel) {
    adminPanel.style.display = 'block';
  }

  if ((isAdmin || isUser) && obrolan) {
    obrolan.style.display = 'block';
    if (obrolanDot) obrolanDot.style.display = 'block';
  }

  if (!isAdmin && !isUser) {
    if (obrolan) obrolan.style.display = 'none';
    if (obrolanDot) obrolanDot.style.display = 'none';
  }

  const menuList = [
    'login-user',
    'ruang-diskusi',
    'galeri',
    'anggota',
    'persuratan',
    'kaderisasi',
    'tentang',
    'admin-panel'
  ];

  menuList.forEach(menu => {
    const menuItem = document.getElementById(`menu-${menu}`);
    const dotItem = document.getElementById(`dot-${menu}`);
    const status = localStorage.getItem(`menu-${menu}`);
    const isVisible = (status === null || status === 'true');

    if (menu === 'ruang-diskusi' && !isAdmin && !isUser) {
      if (menuItem) menuItem.style.display = 'none';
      if (dotItem) dotItem.style.display = 'none';
      return;
    }

    if (menu === 'admin-panel' && !isAdmin) {
      if (menuItem) menuItem.style.display = 'none';
      if (dotItem) dotItem.style.display = 'none';
      return;
    }

    if (menuItem) menuItem.style.display = isVisible ? 'block' : 'none';
    if (dotItem) dotItem.style.display = isVisible ? 'block' : 'none';
  });

  const adminPanelItem = document.getElementById('menu-admin-panel');
  const sidebarDotAdmin = document.getElementById('sidebar-dot');

  if (sidebarDotAdmin) {
    const isVisible = adminPanelItem?.style.display === 'block';
    sidebarDotAdmin.style.display = isVisible ? 'block' : 'none';
  }
});

// Fungsi Logout
function logoutUser() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('isUser');
  window.location.href = 'index.html';
}

// Untuk halaman berita_detail.html
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const beritaList = JSON.parse(localStorage.getItem('beritaList') || '[]');
const berita = beritaList.find(b => b.id === id);

const admin = localStorage.getItem('isAdmin') === 'true';
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const adminBox = document.getElementById('adminAction');
const formBox = document.getElementById('editForm');

if (admin && typeof berita !== 'undefined' && berita) {
  if (adminBox) adminBox.style.display = 'block';

  if (editBtn) {
    editBtn.onclick = () => {
      document.getElementById('editJudul').value = berita.judul;
      document.getElementById('editIsi').value = berita.isi;
      formBox.style.display = 'block';
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (confirm('Yakin ingin menghapus berita ini?')) {
        const updated = beritaList.filter(b => b.id !== berita.id);
        localStorage.setItem('beritaList', JSON.stringify(updated));
        window.location.href = 'berita.html';
      }
    };
  }
}

function simpanEdit() {
  const newJudul = document.getElementById('editJudul').value.trim();
  const newIsi = document.getElementById('editIsi').value.trim();
  const newDeskripsi = newIsi.substring(0, 100) + (newIsi.length > 100 ? '...' : '');

  const index = beritaList.findIndex(b => b.id === berita.id);
  if (index !== -1) {
    beritaList[index].judul = newJudul;
    beritaList[index].isi = newIsi;
    beritaList[index].deskripsi = newDeskripsi;

    localStorage.setItem('beritaList', JSON.stringify(beritaList));
    location.reload();
  }
}
