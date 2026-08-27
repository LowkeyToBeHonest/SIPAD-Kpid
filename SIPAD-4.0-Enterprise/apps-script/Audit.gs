function auditSheet(){const ss=SpreadsheetApp.openById(SHEET_ID);let sh=ss.getSheetByName('AUDIT');if(!sh)sh=ss.insertSheet('AUDIT');if(sh.getLastRow()===0)sh.appendRow(['Waktu','User','Aksi','Nomor']);return sh}
function logActivity(user,aksi,nomor){try{auditSheet().appendRow([new Date(),user||'SYSTEM',aksi||'',nomor||'']);return true;}catch(error){Logger.log('Audit gagal: '+error.message);return false;}}
function getAudit(){const v=auditSheet().getDataRange().getValues(),o=[];for(let i=1;i<v.length;i++)o.push({waktu:v[i][0],user:v[i][1],aksi:v[i][2],nomor:v[i][3]});return o}
