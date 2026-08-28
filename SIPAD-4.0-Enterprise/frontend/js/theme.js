const theme = {
  init() {
    const value = localStorage.getItem("sipad_theme") || "light";
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    return value;
  },

  toggle() {
    const value = this.init() === "dark" ? "light" : "dark";
    localStorage.setItem("sipad_theme", value);
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    return value;
  }
};

theme.init();

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
    avatar.textContent = (localStorage.getItem("sipad_role") || "G").charAt(0);
  }

  document.body.appendChild(avatar);
}

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("sipad_token");
  const isLoginPage = location.pathname.endsWith("/login") ||
                      location.pathname.endsWith("/login.html");

  // hanya redirect kalau benar-benar belum login
  if (!isLoginPage && !token) {
    window.location.replace("/pages/login.html");
    return;
  }

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

});
