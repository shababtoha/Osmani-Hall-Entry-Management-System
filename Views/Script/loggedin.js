$(document).ready(function () {
	

	$.ajax({
		type : 'post',
		url : '/loggedin',
		success : function(data){
			console.log(data);
			if(data=="err"){
				window.location.href="/auth";
			}
		}
	});
})