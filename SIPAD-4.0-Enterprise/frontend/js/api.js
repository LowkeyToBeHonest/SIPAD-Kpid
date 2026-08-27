async function request(action,options={}){
	if(typeof CONFIG==='undefined'||!CONFIG.WEBAPP) throw new Error('URL Web App belum dikonfigurasi');
	const token=localStorage.getItem('sipad_token')||'';
	const query=new URLSearchParams({action,token,...(options.query||{})});
	let response;
	const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
	try{response=await fetch(CONFIG.WEBAPP+(options.method==='POST'?'':'?'+query),options.method==='POST'?{method:'POST',redirect:'follow',credentials:'omit',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...options.body,action,token}),signal:controller.signal}:{signal:controller.signal});}catch(error){throw new Error(error.name==='AbortError'?'Web App terlalu lama merespons. Periksa URL deployment dan akses Anyone.':'Web App tidak dapat dihubungi. Pastikan URL deployment benar dan aksesnya Anyone. Detail: '+error.message);}finally{clearTimeout(timeout);}
	let data;
	try{data=await response.json();}catch(error){throw new Error('Respons Web App tidak valid. Deploy ulang Apps Script sebagai Web app dengan akses Anyone.');}
	if(!response.ok||data.success===false){if(data.error&&/sesi tidak valid|kedaluwarsa/i.test(data.error)){localStorage.removeItem('sipad_token');localStorage.removeItem('sipad_role');if(!/login\.html$/i.test(location.pathname))location.replace('login.html');}throw new Error(data.error||'Permintaan gagal');}
	return data;
}
function setLoading(active,message='Memproses...'){
	let overlay=document.getElementById('appLoading');
	if(active){
		if(!overlay){overlay=document.createElement('div');overlay.id='appLoading';overlay.className='app-loading';overlay.innerHTML='<div class="app-loading-box"><span class="app-spinner"></span><strong></strong></div>';document.body.appendChild(overlay);}
		overlay.querySelector('strong').textContent=message;overlay.classList.add('show');
	}else if(overlay) overlay.classList.remove('show');
}
function notify(title,message,type='success'){
	if(window.Swal) return Swal.fire(title,message,type);
	alert(title+(message?': '+message:''));
}
const api={
	list:()=>request('list'),
	nextNumber:()=>request('nextNumber'),
	audit:()=>request('audit'),
	setting:()=>request('setting'),
	login:(email,password)=>request('login',{method:'POST',body:{email,password}}),
	validate:()=>request('validate'),
	logout:()=>request('logout'),
	upload:data=>request('upload',{method:'POST',body:data}),
	update:data=>request('update',{method:'POST',body:data}),
	updateSetting:data=>request('setting',{method:'POST',body:data}),
	trash:id=>request('trash',{method:'POST',body:{id}}),
	remove:id=>request('trash',{method:'POST',body:{id}}),
	pdf:()=>request('pdf'),
	restore:id=>request('restore',{query:{id}})
};