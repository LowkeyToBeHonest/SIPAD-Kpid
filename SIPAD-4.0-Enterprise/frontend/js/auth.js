async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const button = document.querySelector('button[onclick="login()"]');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    return notify(
      "Login gagal",
      "Email dan password wajib diisi",
      "warning"
    );
  }

  setLoading(true, "Memeriksa akun...");
  if (button) button.disabled = true;

  try {

    const res = await api.login(email, password);
    if (typeof window.saveSipadSession === "function") {
      window.saveSipadSession({
        token: res.token,
        role: res.role,
        name: res.name,
      });
    } else {
      // fallback
      const now = Date.now();
      const ttl = 4 * 60 * 60 * 1000;
    localStorage.setItem("sipad_token", res.token);
    localStorage.setItem("sipad_role", res.role);
    localStorage.setItem("sipad_name", res.name);
    localStorage.setItem("sipad_login_at", String(now));
    localStorage.setItem("sipad_expiry", String(now + ttl));
    }


    window.location.replace("/pages/dashboard.html");

  } catch (err) {

    notify(
      "Login gagal",
      err.message || "Email atau password salah",
      "error"
    );

    if (button) button.disabled = false;

  } finally {
    setLoading(false);
  }
}

function role(){
  return localStorage.getItem("sipad_role") || "GUEST";
}

document.addEventListener("DOMContentLoaded",()=>{

  const pass = document.getElementById("password");

  if(pass){
    pass.addEventListener("keydown",(e)=>{
      if(e.key==="Enter") login();
    });
  }

});
