$(document).ready(function(){
	$.ajax({
		type : 'post',
		url  : '/entry',
		success : function(data){
			//console.log(data);
			$('h3').remove();
			if(Object.keys(data).length==0){

			}
			else{
				
				for(var key in data){
					$("#mydata").append(make_row( data[key] ));
				}
			}
		}
	})
});

function make_row(obj){
	return '<tr>\
					<td>'+obj.name +'</td>\
					<td>'+obj.crse+'</td>\
					<td>'+obj.level+'</td>\
					<td>'+obj.stdid +'</td>\
					<td>'+obj.room+'</td>\
					<td>'+obj.hall+'</td>\
					<td>'+obj.gender+'</td>\
					<td>'+obj.time +'</td>\
					<td>'+obj.date+'</td>\
					<td>'+ obj.return+ '</td>\
				</tr>';
}