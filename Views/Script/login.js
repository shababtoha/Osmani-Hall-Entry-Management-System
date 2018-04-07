function login() {
	console.log("here");
	var  obj = {};
	obj["uname"] = $("#usrname").val();
	obj["psw"] =  $("#pw").val();
	$.ajax({
		type : 'post',
		url  : '/login',
		data : obj,
		success : function(data){
			//console.log(data);
			if(data === "invalid login"){

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