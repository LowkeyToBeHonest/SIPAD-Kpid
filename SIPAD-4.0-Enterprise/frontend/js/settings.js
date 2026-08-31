const settingForm = document.getElementById("settingForm");
const settingLogo = document.getElementById("settingLogo");
const logoPreview = document.getElementById("logoPreview");

const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");

function showLogo(fileOrUrl){
  if(!fileOrUrl) return;

  logoPreview.src =
    typeof fileOrUrl === "string"
      ? fileOrUrl
      : URL.createObjectURL(fileOrUrl);

  logoPreview.classList.add("visible");
}

async function loadSetting(){

  try{

    const data = await api.setting();

    document.getElementById("instansi").value = data.instansi || "";
    document.getElementById("alamat").value = data.alamat || "";

    if(data.logo) showLogo(data.logo);

    // Theme & Language dari localStorage
    if(themeSelect){
      themeSelect.value =
        localStorage.getItem("sipad_theme") || "light";
    }

    if(languageSelect){
      languageSelect.value =
        localStorage.getItem("sipad_language") || "id";
    }

  }catch(error){

    notify(
      "Gagal memuat pengaturan",
      error.message,
      "error"
    );

  }

}

settingLogo.addEventListener("change",()=>{
  showLogo(settingLogo.files[0]);
});

settingForm.addEventListener("submit", async event=>{

  event.preventDefault();

  const button = document.getElementById("saveSetting");
  const file = settingLogo.files[0];

  if(file && file.size > 5 * 1024 * 1024){
    return notify(
      "Logo terlalu besar",
      "Ukuran maksimum logo adalah 5 MB",
      "warning"
    );
  }

  setLoading(true,"Menyimpan pengaturan...");
  button.disabled = true;

  try{

    const data = {
      instansi: document.getElementById("instansi").value.trim(),
      alamat: document.getElementById("alamat").value.trim(),
      logo: null
    };

    if(!data.instansi){
      return notify(
        "Lengkapi data",
        "Nama instansi wajib diisi",
        "warning"
      );
    }

    if(file){

      const reader = new FileReader();

      data.logo = await new Promise((resolve,reject)=>{

        reader.onload = ()=> resolve({
          filename: file.name,
          mime: file.type,
          data: reader.result.split(",")[1]
        });

        reader.onerror = reject;

        reader.readAsDataURL(file);

      });

    }

    const result = await api.updateSetting(data);

    // ===========================
    // SIMPAN TEMA & BAHASA
    // ===========================

    if(themeSelect){
      localStorage.setItem(
        "sipad_theme",
        themeSelect.value
      );

      if(window.theme){
        theme.apply(themeSelect.value);
      }
    }

    if(languageSelect){
      localStorage.setItem(
        "sipad_language",
        languageSelect.value
      );

      if(typeof applyLanguage === "function"){
        applyLanguage(languageSelect.value);
      }
    }

    setLoading(false);

    await notify(
      "Berhasil",
      "Pengaturan berhasil disimpan",
      "success"
    );

    if(result.setting.logo){
      showLogo(result.setting.logo);
    }

  }catch(error){

    setLoading(false);

    notify(
      "Gagal menyimpan pengaturan",
      error.message,
      "error"
    );

  }finally{

    button.disabled = false;

  }

});

loadSetting();
