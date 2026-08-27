document.addEventListener('DOMContentLoaded',async()=>{
  const numberInput=document.getElementById('nomor');
  const dropZone=document.getElementById('dropZone');
  const fileInput=document.getElementById('file');
  const fileName=document.getElementById('fileName');
  try{const result=await api.nextNumber();numberInput.value=result.number;numberInput.readOnly=true;}
  catch(error){numberInput.placeholder='Nomor otomatis tersedia saat disimpan';console.error(error);}
  const showFile=file=>{if(!file)return;fileName.textContent=file.name+' ('+(file.size/1024/1024).toFixed(2)+' MB)';dropZone.classList.remove('is-dragging');};
  dropZone.addEventListener('click',()=>fileInput.click());
  dropZone.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')fileInput.click();});
  fileInput.addEventListener('change',()=>showFile(fileInput.files[0]));
  ['dragenter','dragover'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.add('is-dragging');}));
  ['dragleave','drop'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.remove('is-dragging');}));
  dropZone.addEventListener('drop',event=>{const files=event.dataTransfer.files;if(files.length){fileInput.files=files;showFile(files[0]);}});
});

async function upload(){
  const fileInput=document.getElementById('file'),button=document.getElementById('uploadButton'),file=fileInput.files[0];
  if(!file)return notify('Pilih file','File arsip wajib dipilih','warning');
  if(file.size>100*1024*1024)return notify('File terlalu besar','Ukuran maksimum adalah 100 MB','warning');
  if(file.size>35*1024*1024)return notify('File terlalu besar untuk Apps Script','File di atas 35 MB membesar saat dikirim sebagai Base64. Gunakan file lebih kecil atau upload langsung ke Google Drive.','warning');
  const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png'];
  if(!file.type||(!file.type.startsWith('video/')&&!allowed.includes(file.type)))return notify('Format tidak didukung','Gunakan PDF, DOC, DOCX, JPG, PNG, atau video','warning');
  const payload={judul:document.getElementById('judul').value.trim(),kategori:document.getElementById('kat').value,tanggal:document.getElementById('tgl').value,filename:file.name,mime:file.type,data:''};
  if(!payload.judul||!payload.tanggal)return notify('Lengkapi data','Judul dan tanggal wajib diisi','warning');
  setLoading(true,'Mengunggah arsip...');if(button)button.disabled=true;
  const reader=new FileReader();
  reader.onload=async()=>{try{payload.data=reader.result.split(',')[1];const result=await api.upload(payload);setLoading(false);await notify('Berhasil','Arsip '+result.nomor+' tersimpan','success');location='arsip.html';}catch(error){setLoading(false);notify('Gagal mengunggah',error.message,'error');if(button)button.disabled=false;}};
  reader.onerror=()=>{setLoading(false);notify('Gagal membaca file','Silakan pilih file lain','error');if(button)button.disabled=false;};
  reader.readAsDataURL(file);
}
