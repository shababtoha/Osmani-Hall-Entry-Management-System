function logout()
{
	$.ajax({
		type : 'post',
		url  : '/logout',
		success : function(data){
			if(data==="ok"){
				window.location.href = "/auth";
			}
		}
	});
}