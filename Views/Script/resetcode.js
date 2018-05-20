var code;

$(document).ready(function(){
	url = window.location.href;
	url = url.split('+')[1];
	//console.log(url);

});

function reset(){
	;
	var pass=  $("#newpw").val();
	var cpass = $("#confirmpw").val();
	if( pass.length < 5){

		$.toast({
    		heading: 'Error',
   			 text: 'Password Must contain at least 5 character',
    		showHideTransition: 'fade',
    		icon: 'error'
		});
		return;
	}
	if(pass!==cpass){
		$.toast({
    		heading: 'Error',
   			text: 'Password does not match',
    		showHideTransition: 'fade',
    		icon: 'error'
		});
		return;
	}
	code =url;
	$.ajax({
		type : 'post',
		url  : '/newpassword',
		data : { 'code' : code , 'pass' : pass },
		success : function(data){
			if(data=="success"){
				$.toast({
				    heading: 'Success',
				    text: 'Password Changed Successfully',
				    showHideTransition: 'slide',
				    icon: 'success'
				});

				setTimeout(s,3000);
			}
			else{
				$.toast({
    				heading: 'Error',
   					text: 'Something Went Wrong',
    				showHideTransition: 'fade',
    				icon: 'error'
				});
			}
		}
	})
}

var s =function(){
	window.location.href ="/auth";
}