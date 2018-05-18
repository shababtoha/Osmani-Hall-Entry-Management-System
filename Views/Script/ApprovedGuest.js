$(document).ready(function(){
	//console.log("aise");	
	$.ajax({
		type : 'post',
		url  : '/gueststatus',
		success : function(data){
			//console.log(data);
			$('h3').remove();
			for(var i = 0 ; i < data.length;i++){
				$("#guests").append( make_list(data[i]));
			}
		}
	});

});
var color = {
	"Approved" : 'style="background : green ; color : white"',
	"Rejected" : 'style="background : red ; color : white"',
	"Pending"  : ""
}

function  make_list(obj){
	return '<tr>\
	<td class="left">'+ obj.stdname+'</td>\
						<td>'+obj.crse+'</td>\
						<td>'+obj.stdid+'</td>\
						<td>'+obj.level+'</td>\
					  	<td '+color[obj.Status] +'><strong>'+obj.Status+'</strong></td>\
					  	</tr>';
}