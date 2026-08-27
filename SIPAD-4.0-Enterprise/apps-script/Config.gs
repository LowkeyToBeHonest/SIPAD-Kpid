const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const SHEET_ID = SCRIPT_PROPERTIES.getProperty('SHEET_ID') || '';
const FOLDER_ID = SCRIPT_PROPERTIES.getProperty('FOLDER_ID') || '';

function configure(sheetId,folderId){
	if(!sheetId||!folderId) throw new Error('sheetId dan folderId wajib diisi');
	SCRIPT_PROPERTIES.setProperties({SHEET_ID:String(sheetId),FOLDER_ID:String(folderId)});
	return {success:true};
}

function sheet(){
	if(!SHEET_ID) throw new Error('SHEET_ID belum dikonfigurasi di Script Properties');
	const sh=SpreadsheetApp.openById(SHEET_ID).getSheetByName('ARSIP');
	if(!sh) throw new Error('Sheet ARSIP belum dibuat. Jalankan install() terlebih dahulu');
	return sh;
}

function json(value){
	return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
