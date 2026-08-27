function getArsip(){
	const v=sheet().getDataRange().getValues(),o=[];
	for(let i=1;i<v.length;i++) if(v[i][0]!==''&&v[i][7]!=='TRASH') o.push({id:v[i][0],nomor:v[i][1],judul:v[i][2],kategori:v[i][3],tanggal:v[i][4],file:previewUrl(fileIdFromUrl(v[i][6]))||v[i][6],status:v[i][7]||'AKTIF'});
	return o;
}

function createArsip(obj){
	['judul','kategori','tanggal','filename','mime','data'].forEach(k=>{if(!obj[k]) throw new Error(k+' wajib diisi')});
	const lock=LockService.getScriptLock();lock.waitLock(30000);
	try{
		const sh=sheet(),id=new Date().getTime(),nomor=nextNumber(),file=saveToCategory(obj);
		sh.appendRow([id,nomor,obj.judul,obj.kategori,obj.tanggal,obj.keterangan||'',file,'AKTIF']);
		const auditLogged=logActivity(obj.user||'SYSTEM','UPLOAD',nomor);
		return {success:true,id:id,nomor:nomor,file:file,auditLogged:auditLogged};
	}finally{lock.releaseLock();}
}

function updateArsip(obj){
	const sh=sheet(),v=sh.getDataRange().getValues();
	for(let i=1;i<v.length;i++) if(v[i][0]==obj.id){sh.getRange(i+1,3).setValue(obj.judul);logActivity(obj.user||'SYSTEM','UPDATE',v[i][1]);return {success:true};}
	return {success:false,error:'Arsip tidak ditemukan'};
}

function trashArsip(id){
	const sh=sheet(),v=sh.getDataRange().getValues();
	for(let i=1;i<v.length;i++) if(v[i][0]==id){sh.getRange(i+1,8).setValue('TRASH');logActivity('SYSTEM','TRASH',v[i][1]);return {success:true};}
	return {success:false,error:'Arsip tidak ditemukan'};
}