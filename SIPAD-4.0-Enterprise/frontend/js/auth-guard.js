// SIPAD Auth Guard — session expiry ± 4 jam
// Setiap halaman terproteksi memanggil guardSession() di <head>
(function () {
  var SIPAD_SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 jam

  window.SIPAD_SESSION_TTL_MS = SIPAD_SESSION_TTL_MS;

  window.saveSipadSession = function (data) {
    var now = Date.now();
    localStorage.setItem("sipad_token", data.token);
    localStorage.setItem("sipad_role", data.role || "");
    localStorage.setItem("sipad_name", data.name || "");
    localStorage.setItem("sipad_login_at", String(now));
    localStorage.setItem("sipad_expiry", String(now + SIPAD_SESSION_TTL_MS));
  };

  window.clearSipadSession = function () {
    localStorage.removeItem("sipad_token");
    localStorage.removeItem("sipad_role");
    localStorage.removeItem("sipad_name");
    localStorage.removeItem("sipad_login_at");
    localStorage.removeItem("sipad_expiry");
  };

  window.isSipadSessionValid = function () {
    var token = localStorage.getItem("sipad_token");
    var expiry = parseInt(localStorage.getItem("sipad_expiry") || "0", 10);
    if (!token || !expiry) return false;
    if (Date.now() >= expiry) return false;
    return true;
  };

  // Rolling refresh: perpanjang saat halaman valid dibuka
  window.touchSipadSession = function () {
    if (window.isSipadSessionValid()) {
      localStorage.setItem(
        "sipad_expiry",
        String(Date.now() + SIPAD_SESSION_TTL_MS)
      );
    }
  };

  // Pelindung halaman: panggil di <head> halaman protected
  window.guardSession = function (loginPath) {
    var target = loginPath || "/pages/login.html";
    if (!window.isSipadSessionValid()) {
      window.clearSipadSession();
      window.location.replace(target);
      return false;
    }
    window.touchSipadSession();
    return true;
  };

  // Auto-redirect saat token kedaluwarsa di tab lain
  window.addEventListener("storage", function (e) {
    if (
      (e.key === "sipad_token" || e.key === "sipad_expiry") &&
      !window.isSipadSessionValid() &&
      !/login\.html$/.test(window.location.pathname)
    ) {
      window.clearSipadSession();
      window.location.replace("/pages/login.html");
    }
  });
})();
