const USERS=[{email:'admin@kpid.go.id',password:'12345',role:'ADMIN'},{email:'operator@kpid.go.id',password:'12345',role:'OPERATOR'},{email:'pimpinan@kpid.go.id',password:'12345',role:'PIMPINAN'}];
const SESSION_TTL=21600,LOGIN_LIMIT=5;
function loginUser(email,password){
	email=String(email||'').trim().toLowerCase();const cache=CacheService.getScriptCache(),key='login_fail_'+Utilities.base64EncodeWebSafe(email).replace(/=/g,'');let failures=Number(cache.get(key)||0);
	if(failures>=LOGIN_LIMIT)return {success:false,error:'Terlalu banyak percobaan. Coba lagi dalam 15 menit'};
	const user=USERS.find(item=>item.email===email&&item.password===String(password||''));
	if(!user){cache.put(key,String(failures+1),900);return {success:false,error:'Email atau password salah'};}
	cache.remove(key);const token=Utilities.getUuid();CacheService.getScriptCache().put('session_'+token,JSON.stringify({email:user.email,role:user.role,name:user.email}),SESSION_TTL);return {success:true,token:token,role:user.role,name:user.email,expiresIn:SESSION_TTL};
}
function validateToken(token){const value=CacheService.getScriptCache().get('session_'+String(token||''));if(!value)return {success:false,error:'Sesi tidak valid atau sudah kedaluwarsa'};return {success:true,user:JSON.parse(value)};}
function logoutUser(token){CacheService.getScriptCache().remove('session_'+String(token||''));return {success:true};}
