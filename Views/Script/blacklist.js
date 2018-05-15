$(document).ready(function(){
	$.ajax({
		type : 'post',
		url  : '/getblacklist',
		success : function(data){
			console.log(data);
			for(var key in data){
				if(data[key].hasOwnProperty("late")){
					//console.log("OK");
					$("#mydata").append(make_row(data[key]));
				}
			}

		}
	})
});

function make_row(obj){
	return	'<tr>\
				<td onclick=\' profile(\"'+obj._id +' \") \' style="cursor : pointer"> '+obj.name +' </td>\
				<td>'+obj.crse+'</td>\
				<td>'+obj.level+'</td>\
				<td>'+obj.stdid+'</td>\
				<td>'+obj.room+'</td>\
				<td>'+obj.hall+'</td>\
				<td>'+obj.gender+'</td>\
				<td>'+obj.late+'</td>\
				<td>'+obj.contact+'</td>\
			</tr>';

}
function profile(id){
	window.location.href= "/studentprofile?id="+id;
}