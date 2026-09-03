document.addEventListener("DOMContentLoaded", async () => {

  const numberInput = document.getElementById("nomor");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");
  const uploadBtn = document.getElementById("btnUpload");

  // Nomor arsip otomatis
  try {
    const result = await api.nextNumber();
    numberInput.value = result.number;
    numberInput.readOnly = true;
  } catch (err) {
    numberInput.placeholder = "Nomor otomatis tersedia saat disimpan";
    console.error(err);
  }

  // Tampilkan nama file
  function showFile(file){
    if(!file) return;
    fileName.textContent =
      `${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`;
    dropZone.classList.remove("is-dragging");
  }

  // Pilih file
  dropZone.addEventListener("click", ()=> fileInput.click());

  fileInput.addEventListener("change", ()=>{
    showFile(fileInput.files[0]);
  });

  // Drag & Drop
  ["dragenter","dragover"].forEach(e=>{
    dropZone.addEventListener(e,ev=>{
      ev.preventDefault();
      dropZone.classList.add("is-dragging");
    });
  });

  ["dragleave","drop"].forEach(e=>{
    dropZone.addEventListener(e,ev=>{
      ev.preventDefault();
      dropZone.classList.remove("is-dragging");
    });
  });

  dropZone.addEventListener("drop",ev=>{
    const files = ev.dataTransfer.files;
    if(files.length){
      fileInput.files = files;
      showFile(files[0]);
    }
  });

  // Tombol upload
  uploadBtn.addEventListener("click", upload);

});

async function upload(){

  const fileInput = document.getElementById("fileInput");
  const button = document.getElementById("btnUpload");
  const file = fileInput.files[0];

  if(!file){
    return alert("Pilih file terlebih dahulu.");
  }

  if(file.size > 35 * 1024 * 1024){
    return alert("Ukuran maksimal 35 MB.");
  }

  const payload = {
    judul: document.getElementById("judul").value.trim(),
    kategori: document.getElementById("kategori").value,
    tanggal: document.getElementById("tanggal").value,
    bidang: document.getElementById("bidang").value.trim(),
    keterangan: document.getElementById("deskripsi").value.trim(),
    filename: file.name,
    mime: file.type,
    data: ""
  };

  if(!payload.judul || !payload.tanggal){
    return alert("Judul dan tanggal wajib diisi.");
  }

  button.disabled = true;
  button.textContent = "Mengunggah...";

  const reader = new FileReader();

  reader.onload = async ()=>{

    try{

      payload.data = reader.result.split(",")[1];

      const result = await api.upload(payload);

      alert(`Arsip ${result.nomor} berhasil disimpan`);

      location.href = "arsip.html";

    }catch(err){

      alert(err.message || "Upload gagal");
      button.disabled = false;
      button.textContent = "Simpan Arsip";

    }

  };

  reader.readAsDataURL(file);

}
