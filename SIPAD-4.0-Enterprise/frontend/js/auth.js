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

    localStorage.setItem("sipad_token", res.token);
    localStorage.setItem("sipad_role", res.role);
    localStorage.setItem("sipad_name", res.name);

    window.location.replace("/pages/index.html");

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
