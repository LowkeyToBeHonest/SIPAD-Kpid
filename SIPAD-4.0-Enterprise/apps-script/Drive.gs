function authorizeDrive(){
	if(!FOLDER_ID) throw new Error('FOLDER_ID belum dikonfigurasi di Script Properties');
	const folder=DriveApp.getFolderById(FOLDER_ID);
	return {success:true,folder:folder.getName()};
}
function saveToCategory(data){
	if(!FOLDER_ID)throw new Error('FOLDER_ID belum dikonfigurasi di Script Properties');
	try{
		const root=DriveApp.getFolderById(FOLDER_ID),year=(data.tanggal||'').split('-')[0]||'Umum',y=getFolder(root,year),k=getFolder(y,data.kategori),file=k.createFile(Utilities.newBlob(Utilities.base64Decode(data.data),data.mime,data.filename));
		try{file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);}catch(shareError){Logger.log('Sharing file gagal: '+shareError.message);}
		return previewUrl(file.getId());
	}catch(error){throw new Error('Gagal membuat file di Google Drive. Pastikan FOLDER_ID benar dan akun script memiliki akses. Detail: '+error.message);}
}
function getFolder(parent,name){const f=parent.getFoldersByName(name);return f.hasNext()?f.next():parent.createFolder(name);}
function previewUrl(fileId){return 'https://drive.google.com/file/d/'+fileId+'/preview';}
function imageUrl(fileId){return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(fileId)+'&sz=w512';}
function fileIdFromUrl(url){const match=String(url||'').match(/[-\w]{25,}/);return match?match[0]:'';}

function saveLogo(data){
	if(!data||!data.data) return '';
	if(!FOLDER_ID)throw new Error('FOLDER_ID belum dikonfigurasi di Script Properties');
	const folder=getFolder(DriveApp.getFolderById(FOLDER_ID),'Pengaturan'),file=folder.createFile(Utilities.newBlob(Utilities.base64Decode(data.data),data.mime||'image/png',data.filename||'logo.png'));
	try{file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);}catch(error){Logger.log('Sharing logo gagal: '+error.message);}
	return imageUrl(file.getId());
}

function makeFileViewable(fileId){
	DriveApp.getFileById(fileId).setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
	return {success:true};
}

function makeExistingFilesViewable(){
	const sh=sheet(),rows=sh.getDataRange().getValues(),updated=rows.slice(1).reduce((count,row,index)=>{
		const fileId=fileIdFromUrl(row[6]);
		if(!fileId)return count;
		try{makeFileViewable(fileId);sh.getRange(index+2,7).setValue(previewUrl(fileId));return count+1;}catch(error){return count;}
	},0);
	return {success:true,updated:updated};
}