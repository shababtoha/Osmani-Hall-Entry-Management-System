$(document).ready(function(){
	$.ajax({
		type : 'post',
		url  : '/loggedin',
		success : function(data){
			if(data=='err'){
				$("#logout").remove();
			}
			else{
				if(data==="dsw") data="provost";
				$("#login").html(data.toUpperCase());
			}
		}
	})
});