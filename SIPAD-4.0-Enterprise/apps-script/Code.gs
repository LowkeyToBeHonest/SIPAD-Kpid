function doGet(e){
  try{
    const params=(e&&e.parameter)||{},action=params.action||'';
    if(action==='login')return json(loginUser(params.email,params.password));
    if(action==='validate')return json(validateToken(params.token));
    if(action==='logout')return json(logoutUser(params.token));
    if(!requireSession(params.token))return json({success:false,error:'Sesi tidak valid atau sudah kedaluwarsa'});
    if(action==='list')return json(getArsip());
    if(action==='nextNumber')return json({success:true,number:nextNumber()});
    if(action==='audit')return json(getAudit());
    if(action==='setting')return json(getSetting());
    if(action==='restore')return json(restoreArsip(params.id));
    if(action==='excel')return exportCSV();
    if(action==='pdf')return json(exportPDF());
    return json({success:false,error:'Aksi tidak dikenal'});
  }catch(error){return json({success:false,error:error.message});}
}

function doPost(e){
  try{
    const body=JSON.parse((e&&e.postData&&e.postData.contents)||'{}'),action=body.action||'';
    if(action==='login')return json(loginUser(body.email,body.password));
    if(action==='validate')return json(validateToken(body.token));
    if(action==='logout')return json(logoutUser(body.token));
    if(!requireSession(body.token))return json({success:false,error:'Sesi tidak valid atau sudah kedaluwarsa'});
    if(action==='upload')return json(createArsip(body));
    if(action==='update')return json(updateArsip(body));
    if(action==='trash')return json(trashArsip(body.id));
    if(action==='setting')return json(updateSetting({...body,logo:saveLogo(body.logo)||body.logo||''}));
    return json({success:false,error:'Aksi tidak dikenal'});
  }catch(error){return json({success:false,error:error.message});}
}

function requireSession(token){return validateToken(token).success;}
