let DATA=[];
const reportSearch=document.getElementById('reportSearch');
const reportCategory=document.getElementById('reportCategory');
const reportBody=document.getElementById('tb');

function renderReport(){
  const query=(reportSearch.value||'').toLowerCase();
  const category=reportCategory.value;
  const filtered=DATA.filter(item=>(!category||item.kategori===category)&&JSON.stringify(item).toLowerCase().includes(query));
  reportBody.innerHTML='';
  filtered.forEach(item=>{const row=document.createElement('tr');[item.nomor,item.judul,item.kategori,item.tanggal].forEach(value=>{const cell=document.createElement('td');cell.textContent=value||'-';row.appendChild(cell);});reportBody.appendChild(row);});
  if(!filtered.length)reportBody.innerHTML='<tr><td colspan="4" class="empty-state">Tidak ada arsip yang sesuai.</td></tr>';
  document.getElementById('reportVisible').textContent=filtered.length;
}

async function load(){
  try{DATA=await api.list();document.getElementById('reportTotal').textContent=DATA.length;document.getElementById('reportLetters').textContent=DATA.filter(item=>item.kategori==='Surat').length;document.getElementById('reportOther').textContent=DATA.filter(item=>item.kategori!=='Surat').length;renderReport();}
  catch(error){reportBody.innerHTML='<tr><td colspan="4" class="empty-state">Gagal memuat laporan. Periksa koneksi Web App.</td></tr>';notify('Gagal memuat laporan',error.message,'error');}
}

async function exportExcel(){setLoading(true,'Menyiapkan Excel...');try{window.open(CONFIG.WEBAPP+'?action=excel','_blank');await notify('Export siap','File Excel sedang dibuka.','success');}catch(error){notify('Export gagal',error.message,'error');}finally{setLoading(false);}}
async function exportPDF(){setLoading(true,'Menyiapkan PDF...');try{const result=await api.pdf();window.open(result.url,'_blank');await notify('Export siap','Laporan PDF sedang dibuka.','success');}catch(error){notify('Export gagal',error.message,'error');}finally{setLoading(false);}}
reportSearch.addEventListener('input',renderReport);reportCategory.addEventListener('change',renderReport);load();
