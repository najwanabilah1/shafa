const adminPassword = "admin123";
const ADMIN_USER = "admin";

// =======================
// DATA LOCAL STORAGE
// =======================
let data = JSON.parse(localStorage.getItem("madingData")) || {
  berita: [],
  lomba: [],
  galeri: []
};
localStorage.setItem("madingData", JSON.stringify(data));

// =======================
// CURRENT USER & SESSION
// =======================
let currentUser = sessionStorage.getItem("currentUser") || null;

function isLoggedIn() {
  return currentUser !== null;
}

function isAdmin() {
  return currentUser === ADMIN_USER;
}

// =======================
// LOGIN MODAL (INDEX)
// =======================
function initLoginModal() {
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLoginBtn = document.getElementById("closeLogin");
  const loginForm = document.getElementById("loginForm");
  const userInfo = document.getElementById("userInfo");

  if (!loginBtn || !loginModal) return;

  if (isLoggedIn()) {
    loginBtn.classList.add("hidden");
    if (userInfo) userInfo.classList.remove("hidden");
    document.getElementById("userName").textContent = currentUser;
  } else {
    loginBtn.classList.remove("hidden");
    if (userInfo) userInfo.classList.add("hidden");
  }

  loginBtn.onclick = () => loginModal.classList.remove("hidden");
  if (closeLoginBtn) closeLoginBtn.onclick = () => loginModal.classList.add("hidden");

  loginModal.onclick = (e) => {
    if (e.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  };

  loginForm.onsubmit = function (e) {
    e.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    if (username === ADMIN_USER && password === adminPassword) {
      sessionStorage.setItem("currentUser", ADMIN_USER);
      currentUser = ADMIN_USER;
      loginModal.classList.add("hidden");
      alert("Login berhasil!");
      window.location.href = "admin.html";
    } else {
      alert("Username atau password salah!");
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoginModal);
} else {
  initLoginModal();
}

// =======================
// LOGIN ADMIN DASHBOARD
// =======================
if (document.getElementById("admin-area")) {
  if (!localStorage.getItem("adminLogin")) {
    document.getElementById("admin-area").innerHTML = `
      <h3>Login Admin</h3>
      <input id="pass" type="password" placeholder="Password Admin">
      <button onclick="loginAdmin()">Login</button>
    `;
  } else {
    document.getElementById("admin-area").innerHTML = `
      <h3>Dashboard CRUD</h3>
      <a href="admin-berita.html">✅ Kelola Berita</a><br><br>
      <a href="admin-lomba.html">✅ Kelola Lomba</a><br><br>
      <a href="admin-galeri.html">✅ Kelola Galeri</a>
    `;
  }
}

function loginAdmin() {
  let pass = document.getElementById("pass").value;
  if (pass === adminPassword) {
    localStorage.setItem("adminLogin", true);
    location.reload();
  } else {
    alert("Password salah!");
  }
}

function logout() {
  sessionStorage.removeItem("currentUser");
  currentUser = null;
  localStorage.removeItem("adminLogin");
  window.location.href = "index.html";
}

function checkAdminAuth() {
  if (!isAdmin() && !localStorage.getItem("adminLogin")) {
    window.location.href = "index.html";
  }
}

// =======================
// CRUD BERITA
// =======================
function tambahBerita() {
  data.berita.push({
    judul: judulBerita.value,
    isi: isiBerita.value,
    gambar: gambarBerita?.value || ""
  });
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

function hapusBerita(i) {
  data.berita.splice(i, 1);
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

// =======================
// CRUD LOMBA
// =======================
function tambahLomba() {
  data.lomba.push({
    judul: judulLomba.value,
    isi: isiLomba.value,
    gambar: gambarLomba?.value || ""
  });
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

function hapusLomba(i) {
  data.lomba.splice(i, 1);
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

// =======================
// CRUD GALERI
// =======================
function tambahGaleri() {
  data.galeri.push({
    judul: judulGaleri.value,
    isi: isiGaleri.value,
    gambar: gambarGaleri?.value || ""
  });
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

function hapusGaleri(i) {
  data.galeri.splice(i, 1);
  localStorage.setItem("madingData", JSON.stringify(data));
  location.reload();
}

// =======================
// RENDER BERITA / CARD
// =======================
function tampil(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = arr.map(item => `
    <div class="card">
      <div class="thumb">
        <img src="${item.gambar || 'https://picsum.photos/400/300'}">
        <span class="badge">Update</span>
      </div>
      <div class="body">
        <h4>${item.judul}</h4>
        <p>${item.isi.substring(0, 80)}...</p>
        <div class="card-foot">Diposting Admin</div>
      </div>
    </div>
  `).join("");
}

// =======================
// RENDER GALERI KHUSUS GRID
// =======================
function tampilGaleri(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = arr.map(item => `
    <div class="gallery-item">
      <img src="${item.gambar || 'https://picsum.photos/300'}">
      <p>${item.judul}</p>
    </div>
  `).join("");
}

// =======================
// RENDER KE SEMUA HALAMAN
// =======================
tampil("list-berita", data.berita);
tampilGaleri("list-galeri", data.galeri);
tampil("newsList", data.berita.slice(-3));
tampil("infoList", data.lomba.slice(-3));
tampilGaleri("galleryList", data.galeri.slice(-6));

// =======================
// RENDER USER (CARD MODEL DESIGN) UNTUK LOMBA MULTI-GAMBAR
// =======================
function tampilLomba(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = arr.map(item => {
    let gambar = "";
    if (Array.isArray(item.gambar)) {
      gambar = item.gambar[0]; // ambil gambar pertama saja
    } else {
      gambar = item.gambar || 'https://picsum.photos/400/300';
    }

    return `
      <div class="card">
        <div class="thumb">
          <img src="${gambar}">
          <span class="badge">Update</span>
        </div>
        <div class="body">
          <h4>${item.judul}</h4>
          <p>${item.isi.substring(0, 80)}...</p>
          <div class="card-foot">Diposting Admin</div>
        </div>
      </div>
    `;
  }).join("");
}

// =======================
// RENDER LOMBA (CARD)
// =======================
function tampilLomba(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = arr.map(item => {
    let gambar = "";
    if (Array.isArray(item.gambar)) {
      gambar = item.gambar[0]; // ambil gambar pertama
    } else {
      gambar = item.gambar || 'https://picsum.photos/400/300';
    }

    return `
      <div class="card">
        <div class="thumb">
          <img src="${gambar}">
          <span class="badge">Update</span>
        </div>
        <div class="body">
          <h4>${item.judul}</h4>
          <p>${item.isi.substring(0, 80)}...</p>
          <div class="card-foot">Diposting Admin</div>
        </div>
      </div>
    `;
  }).join("");
}

// =======================
// RENDER SEMUA DI HOMEPAGE
// =======================
tampil("list-berita", data.berita);
tampilGaleri("list-galeri", data.galeri);
tampil("newsList", data.berita);       
tampilLomba("infoList", data.lomba);  
tampilGaleri("galleryList", data.galeri); 
