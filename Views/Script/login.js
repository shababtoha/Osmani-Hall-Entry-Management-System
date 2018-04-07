function login() {
	console.log("here");
	var  obj = {};
	obj["uname"] = $("#usrname").val();
	obj["psw"] =  $("#pw").val();
	obj["remember"] = $("#rmbr").val();
	$.ajax({
		type : 'post',
		url  : '/login',
		data : obj,
		success : function(data){
			console.log(data);
		}
	});
}