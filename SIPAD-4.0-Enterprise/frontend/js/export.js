let DATA=[];
const reportSearch=document.getElementById('reportSearch');
const reportCategory=document.getElementById('reportCategory');
const reportBody=document.getElementById('tb');
if(reportCategory)reportCategory.innerHTML='<option value="">Semua kategori</option><option>Surat Masuk</option><option>Surat Keluar</option><option>Laporan</option><option>Dokumentasi</option>';

function renderReport(){
  const query=(reportSearch.value||'').toLowerCase();
  const category=reportCategory.value;
  const filtered=DATA.filter(item=>(!category||item.kategori===category)&&JSON.stringify(item).toLowerCase().includes(query));
  reportBody.innerHTML='';
  filtered.forEach(item=>{const row=document.createElement('tr');[item.nomor,item.judul,item.kategori,item.tanggal].forEach(value=>{const cell=document.createElement('td');cell.textContent=value||'-';row.appendChild(cell);});reportBody.appendChild(row);});
  if(!filtered.length)reportBody.innerHTML='<tr><td colspan="4" class="empty-state">Tidak ada arsip yang sesuai.</td></tr>';
}

function renderArchiveChart(){
  const canvas=document.getElementById('archiveChart');
  if(!canvas||!window.Chart)return;
  const months={};
  DATA.forEach(item=>{
    const date=new Date(item.tanggal);
    if(isNaN(date.getTime()))return;
    const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    months[key]=(months[key]||{});
    months[key][item.kategori]=(months[key][item.kategori]||0)+1;
  });
  const keys=Object.keys(months).sort().slice(-6);
  const monthNames=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  document.getElementById('chartPeriod').textContent=keys.length?`${monthNames[Number(keys[0].slice(5))-1]} - ${monthNames[Number(keys[keys.length-1].slice(5))-1]} ${keys[keys.length-1].slice(0,4)}`:'Belum ada tanggal dokumen';
  const categories=['Dokumentasi','Laporan','Surat Keluar','Surat Masuk'];
  const colors=['#a78bfa','#60a5fa','#f59e0b','#32d394'];
  new Chart(canvas,{type:'bar',data:{labels:keys.map(key=>monthNames[Number(key.slice(5))-1]),datasets:categories.map((category,index)=>({label:category,data:keys.map(key=>months[key][category]||0),backgroundColor:colors[index],borderRadius:6,borderSkipped:false,barPercentage:.72,categoryPercentage:.72}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{color:'#647896',padding:18,usePointStyle:false,boxWidth:18,boxHeight:12}},tooltip:{backgroundColor:'#0b1728',borderColor:'rgba(148,163,184,.18)',borderWidth:1,titleColor:'#f8fafc',bodyColor:'#cbd5e1',padding:14,displayColors:false,caretPadding:10}},scales:{x:{grid:{display:false},ticks:{color:'#536783',font:{size:14}},border:{display:false}},y:{beginAtZero:true,ticks:{precision:0,color:'#536783',font:{size:14},padding:8},grid:{color:'rgba(148,163,184,.08)',borderDash:[4,4]},border:{display:false}}}}});
}

async function load(){
  try{DATA=await api.list();document.getElementById('reportTotal').textContent=DATA.length;document.getElementById('reportLetters').textContent=DATA.filter(item=>item.kategori==='Surat Masuk').length;document.getElementById('reportOutgoing').textContent=DATA.filter(item=>item.kategori==='Surat Keluar').length;document.getElementById('reportOther').textContent=DATA.filter(item=>item.kategori==='Laporan'||item.kategori==='Dokumentasi').length;renderReport();renderArchiveChart();}
  catch(error){reportBody.innerHTML='<tr><td colspan="4" class="empty-state">Gagal memuat laporan. Periksa koneksi Web App.</td></tr>';notify('Gagal memuat laporan',error.message,'error');}
}

async function exportExcel(){setLoading(true,'Menyiapkan Excel...');try{const token=encodeURIComponent(localStorage.getItem('sipad_token')||'');window.open(`${CONFIG.WEBAPP}?action=excel&token=${token}`,'_blank');await notify('Export siap','File Excel sedang dibuka.','success');}catch(error){notify('Export gagal',error.message,'error');}finally{setLoading(false);}}
async function exportPDF(){setLoading(true,'Menyiapkan PDF...');try{const result=await api.pdf();window.open(result.url,'_blank');await notify('Export siap','Laporan PDF sedang dibuka.','success');}catch(error){notify('Export gagal',error.message,'error');}finally{setLoading(false);}}
reportSearch.addEventListener('input',renderReport);reportCategory.addEventListener('change',renderReport);load();
