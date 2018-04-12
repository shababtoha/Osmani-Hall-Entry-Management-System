
var flag = true;
function reset(){
	var email  =  $("#usrname").val();
	if(!email) return;
	if(!validateEmail(email)){
		$("#usrname").css( { "border" : "1px solid red" } );
		alert("Please Enter A valid Email Address");
		return;
	};
	if(flag!==true) return;
	flag = false;
	$("#spin").addClass("fa fa-spinner fa-spin");
	submit(email);
}
function checkforenter(val){
	$("#usrname").css( { "border" : "1px solid forestgreen" } );
	//console.log(event.key);
	if(event.key=='Enter'){
		//console.log('asdas');
		reset();
	}
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function submit(email){
	$.ajax({
		type : 'post',
		url  : '/resetpass',
		data : { "email" : email },
		success : function(data){
			flag = true;
			$("#spin").removeClass("fa fa-spinner fa-spin");
			if(data==="Mail Sent"){
				alert("A Link Has Been Sent to Your Email");
			}
			else{
				alert("An error Occured. Try Again");
			}

		}
	})
}