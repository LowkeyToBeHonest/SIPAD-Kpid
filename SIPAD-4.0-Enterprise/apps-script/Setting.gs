function getSetting(){
	const sh=SpreadsheetApp.openById(SHEET_ID).getSheetByName('SETTING'),v=sh.getDataRange().getValues();
	const logoId=fileIdFromUrl(v[2]&&v[2][1]||'');
	return {instansi:v[0]&&v[0][1]||'KPID Sulawesi Tengah',alamat:v[1]&&v[1][1]||'',logo:logoId?imageUrl(logoId):''};
}

function updateSetting(data){
	const ss=SpreadsheetApp.openById(SHEET_ID),sh=ss.getSheetByName('SETTING')||ss.insertSheet('SETTING');
	if(sh.getLastRow()===0)sh.getRange(1,1,3,2).setValues([['Instansi',''],['Alamat',''],['Logo','']]);
	const current=getSetting();
	sh.getRange('A1:B3').setValues([['Instansi',data.instansi||'KPID Sulawesi Tengah'],['Alamat',data.alamat||''],['Logo',data.logo||current.logo||'']]);
	logActivity(data.user||'SYSTEM','UPDATE_SETTING',data.instansi||current.instansi);
	return {success:true,setting:getSetting()};
}