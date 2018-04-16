$(document).ready(function(){
	//console.log("here");
	$.ajax({
		type : 'post',
		url : '/getstudentinfo',
		success : function(data){
			console.log(data);
			if(data=="err"){
				$.toast({
    				heading: 'Error',
    				text: 'Something is not right. Please try again',
    				showHideTransition: 'fade',
    				icon: 'error',
    		 		hideAfter : false,
				});
				return;
			}
			for(var i = 0 ; i<data.length;i++){
				$("#mydata").append( make_row(data[i]));
			}

		}
	})

});
function make_row(obj){
	return 	'<tr>\
			<td class="left">'+obj.name+'</td>\
			<td>'+obj.course+'</td>\
			<td>'+obj.level+'</td>\
			<td>'+obj.stdid+'</td>\
			<td>'+obj.room+' </td>\
			<td class="left">'+obj.gender+'</td>\
			<td>'+obj.contact+'</td>\
			<td><button type="button" class="btn btn-primary" style="width:100% ; background:black  ; color:white;" id="edt">Edit</button></td>';
}