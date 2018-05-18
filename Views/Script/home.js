$(document).ready(function(){
	$.ajax({
		type : 'post',
		url  : '/loggedin',
		success : function(data){
			if(data=='err'){

			}
			else{
				$("#login").html(data.toUpperCase());
			}
		}
	})
});