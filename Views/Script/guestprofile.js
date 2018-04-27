$(document).ready(function () {
	$(".container").hide();

	nextguest();
})

var obj = {
		"stdname" : "",
		"stdphn"  : "",
		"grdnname": "",
		"grdnmail": "",
		"grdnphn" : "",
		"prsntaddr": "",
		"crse" 		: "",
		"stdid":"",
		"level":"",
		"reason":"",
		"from" : "",
		"to" : "",
		"gender":""
	}

var socket = io.connect('/');

function nextguest()
{
	$.ajax({
		type : 'post',
		url : '/nextguest',
		success : function(data){
				$(".container").show();
				$("#loading").hide();
		}
	});
}
var id ;

socket.on('next',function(guest){
	//console.log(guest);
	for(var key in obj){
		if(guest!=="nai") $("#"+key).html( guest[key] );
		else{
			$("#"+key).html( "'" );
			id="";
		}
	}
	id = guest._id;
	//console.log(id);
});
function approve(status){

	$(".container").hide();
	$("#loading").show();
	$.ajax({
		type : 'post',
		url : '/chagegueststatus',
		data : {"status" : status+"", "id" : id } ,
		success : function(data){
			$(".container").show();
			$("#loading").hide();
		}
	})
}

