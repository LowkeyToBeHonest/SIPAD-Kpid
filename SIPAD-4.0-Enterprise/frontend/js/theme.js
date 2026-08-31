const i18n = {
  id: {
    workspace: "WORKSPACE",
    dashboard: "Dashboard",
    archives: "Data Arsip",
    upload: "Upload Arsip",
    reports: "Laporan",
    audit: "Audit Aktivitas",
    users: "Pengguna",
    settings: "Pengaturan",
    logout: "Keluar",
    active: "Akses aktif"
  },
  en: {
    workspace: "WORKSPACE",
    dashboard: "Dashboard",
    archives: "Archives",
    upload: "Upload Archive",
    reports: "Reports",
    audit: "Activity Log",
    users: "Users",
    settings: "Settings",
    logout: "Logout",
    active: "Active access"
  }
};

const theme = {

  init() {
    const value = localStorage.getItem("sipad_theme") || "light";
    this.apply(value);
    return value;
  },

  apply(value) {
    if (value === "system") {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      value = dark ? "dark" : "light";
    }

    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
  },

  toggle() {
    const current = localStorage.getItem("sipad_theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("sipad_theme", next);
    this.apply(next);
    return next;
  }

};

// =====================
// BAHASA
// =====================

function applyLanguage(lang = "id") {

  const t = i18n[lang] || i18n.id;

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.dataset.lang;
    if (t[key]) el.textContent = t[key];
  });

  document.documentElement.lang = lang;
}

theme.init();

// =====================
// FOTO PROFIL
// =====================

function profilePhoto() {
  return localStorage.getItem("sipad_profile_photo") || "";
}

function mountProfile() {

  const existing = document.getElementById("globalProfile");
  if (existing) existing.remove();

  const avatar = document.createElement("button");
  avatar.id = "globalProfile";
  avatar.className = "global-profile";
  avatar.type = "button";

  const photo = profilePhoto();

  if (photo) {

    const img = document.createElement("img");
    img.src = photo;
    img.alt = "Foto Profil";
    avatar.appendChild(img);

  } else {

    avatar.textContent =
      (localStorage.getItem("sipad_role") || "G").charAt(0);

  }

  document.body.appendChild(avatar);
}

// =====================
// START
// =====================

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("sipad_token");

  const isLoginPage =
    location.pathname.endsWith("/login") ||
    location.pathname.endsWith("/login.html");

  if (!isLoginPage && !token) {
    location.replace("/pages/login.html");
    return;
  }

  // Terapkan tema & bahasa
  theme.init();
  applyLanguage(localStorage.getItem("sipad_language") || "id");

  mountProfile();

  const input = document.getElementById("profilePhoto");
  const preview = document.getElementById("profilePreview");
  const saved = profilePhoto();

  if (saved && preview) {
    preview.src = saved;
    preview.classList.add("visible");
  }

  if (input) {

    input.addEventListener("change", () => {

      const file = input.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert("Foto maksimal 2 MB");
        input.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {

        localStorage.setItem("sipad_profile_photo", reader.result);
        mountProfile();

        if (preview) {
          preview.src = reader.result;
          preview.classList.add("visible");
        }

      };

      reader.readAsDataURL(file);

    });

  }

  const clear = document.getElementById("clearProfile");

  if (clear) {

    clear.addEventListener("click", () => {

      localStorage.removeItem("sipad_profile_photo");
      mountProfile();

      if (preview) {
        preview.removeAttribute("src");
        preview.classList.remove("visible");
      }

    });

  }

  // =====================
  // SETTINGS PAGE
  // =====================

  const themeSelect = document.getElementById("themeSelect");
  const languageSelect = document.getElementById("languageSelect");
  const saveBtn = document.getElementById("saveBtn");

  if (themeSelect) {
    themeSelect.value =
      localStorage.getItem("sipad_theme") || "light";
  }

  if (languageSelect) {
    languageSelect.value =
      localStorage.getItem("sipad_language") || "id";
  }

  if (saveBtn) {

    saveBtn.addEventListener("click", () => {

      localStorage.setItem("sipad_theme", themeSelect.value);
      localStorage.setItem("sipad_language", languageSelect.value);

      theme.apply(themeSelect.value);
      applyLanguage(languageSelect.value);

      alert("Pengaturan berhasil disimpan");

    });

  }

});
