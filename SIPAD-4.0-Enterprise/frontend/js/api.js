async function request(action, options = {}) {

  if (typeof CONFIG === "undefined" || !CONFIG.WEBAPP) {
    throw new Error("URL Web App belum dikonfigurasi");
  }

  const token = localStorage.getItem("sipad_token") || "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {

    let response;

    if (options.method === "POST") {

      const form = new FormData();
      form.append("action", action);
      form.append("token", token);
      Object.entries(options.body || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) form.append(key, value);
      });

      response = await fetch(CONFIG.WEBAPP, {
        method: "POST",
        body: form,
        signal: controller.signal
      });

    } else {

      const query = new URLSearchParams({
        action,
        token,
        ...(options.query || {})
      });

      response = await fetch(
        `${CONFIG.WEBAPP}?${query.toString()}`,
        { signal: controller.signal }
      );

    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Server mengembalikan error");
    }

    if (data.success === false) {

      if (/sesi tidak valid|kedaluwarsa/i.test(data.error || "")) {
        localStorage.removeItem("sipad_token");
        localStorage.removeItem("sipad_role");

        if (!location.pathname.includes("/login")) {
          window.location.replace("login.html");
        }
      }

      throw new Error(data.error || "Permintaan gagal");
    }

    return data;

  } catch (error) {

    if (error.name === "AbortError") {
      throw new Error("Web App timeout (20 detik)");
    }

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Web App tidak dapat dihubungi. Pastikan deployment Apps Script adalah Web App dengan akses Anyone."
      );
    }

    throw error;

  } finally {
    clearTimeout(timeout);
  }
}

function setLoading(active, message = "Memproses...") {

  let overlay = document.getElementById("appLoading");

  if (active) {

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "appLoading";
      overlay.className = "app-loading";
      overlay.innerHTML = `
        <div class="app-loading-box">
          <span class="app-spinner"></span>
          <strong></strong>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    overlay.querySelector("strong").textContent = message;
    overlay.classList.add("show");

  } else if (overlay) {

    overlay.classList.remove("show");

  }

}

function notify(title, message, type = "success") {

  if (window.Swal) {
    return Swal.fire(title, message, type);
  }

  alert(`${title}${message ? ": " + message : ""}`);

}

const api = {

  summary: () => request("summary"),

  list: () => request("list"),

  nextNumber: () => request("nextNumber"),

  audit: () => request("audit"),

  users: () => request("users"),

  createUser: (data) => request("createUser", { query: data }),

  toggleUser: (email) => request("toggleUser", { query: { email } }),

  setting: () => request("setting"),

  login: (email, password) =>
    request("login", {
      query: { email, password }
    }),

  validate: () => request("validate"),

  logout: () => request("logout"),

  upload: (data) =>
    request("upload", {
      method: "POST",
      body: data
    }),

  update: (data) =>
    request("update", {
      method: "POST",
      body: data
    }),

  updateSetting: (data) =>
    request("setting", {
      method: "POST",
      body: data
    }),

  trash: (id) =>
    request("trash", {
      method: "POST",
      body: { id }
    }),

  remove: (id) =>
    request("trash", {
      method: "POST",
      body: { id }
    }),

  pdf: () => request("pdf"),

  restore: (id) =>
    request("restore", {
      query: { id }
    })

};
