$(document).ready(function () {
	$.ajax({
		type : 'post',
		url : '/getreport',
		success : function(data){
			console.log(data);
			if(Object.keys(data).length==0){

			}
			else{
				for(var key in data){
					$("#mydata").append(make_row( data[key] ));
				}
			}
		}
	});
})





function make_row(obj){
	return '<tr>\
					<td>'+obj.name +'</td>\
					<td>'+obj.crse+'</td>\
					<td>'+obj.level+'</td>\
					<td>'+obj.id +'</td>\
					<td>'+obj.room+'</td>\
					<td>'+obj.hall+'</td>\
					<td>'+obj.expected+'</td>\
					<td>'+obj.date +'</td>\
					<td>'+obj.time+'</td>\
				</tr>' ;
}