$(document).ready(function(){
	var url = window.location.href;
	var value = url.split("value=")[1];
	$.ajax({
		type : 'post',
		url : '/search?value='+value,
		success : function(data){
			//console.log(data);
			if(data=="nai"){
				$("#name").html("No Students Found");
				$("#id").remove();
				$('table').remove();
			}	
			else{
				$("#name").html(data.name);
				$("#id").html(data.id);
				for(var i = 0 ; i<data.history.length;i++){
					$("#ttt").append( '<tr> <td>'+data.history[i].date+'</td><td>'+data.history[i].status+'</td><td>'+data.history[i].time+'</td></tr>' );
				}
			}
		}
	})

});