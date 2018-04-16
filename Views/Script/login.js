var auth = undefined;

$(document).ready(function(){
	var url = window.location.href;
	url = url.split("auth=");
	if(url.length===2) auth = url[1];
	if(auth==="dsw" || auth==="manager" || auth==="Ansar"){

	}else auth = undefined;
	if(!auth) window.location.href = "/auth";
	console.log(auth);
});


function login() {
	//console.log("here");
	$("#spin").addClass("fa fa-spinner fa-spin");
	var  obj = {};
	obj["uname"] = $("#usrname").val();
	obj["psw"]   =  $("#pw").val();
	console.log(auth);
	obj["type"]  = auth;
	$.ajax({
		type : 'post',
		url  : '/login',
		data : obj,
		success : function(data){
			if(data === "invalid login"){
				$("#spin").removeClass("fa fa-spinner fa-spin");
				$.toast({
  				  heading: 'Error',
    				text: 'Invalid Credentials',
    				showHideTransition: 'fade',
    				icon: 'error',
    				hideAfter: false
				});

				return;
			}
			else if(data === "invalid"){

			}
			else{
				window.location.href = "/"+data;
			}
		}
	});
}