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
}


function submit(){	
	
	for(var  key in obj){
		obj[key] = $("#"+key).val();
	}
	obj["gender"] = $("input[type='radio'][name='gender']:checked").val();
	console.log(obj);
}