var obj = { stdname: '',
  				stdphn: '',
  				fatname: '',
  				fatmail: '',
  				fatphn: '',
  				motname: '',
  				motmail: '',
  				motphn: '',
  				prsntaddr: '',
  				pmntaddr: '',
  				crse: '',
  				stdid: '',
  				regno: '',
  				acyear: '',
  				level: '',
  				gender: '',
  				hall: '',
  				gdname: '',
  				gdmail: '',
  				gdphn: '',
  				gdaddr: '',
  				room : '',
 }


$(document).ready(function(){
	//console.log( window.location.href);
	var _id = window.location.href.split('id=')[1];
	$.ajax({
		type : 'post',
		url  : '/getstudent',
		data : { 'id' : _id },
		success : function(data){
			if(data.hasOwnProperty('stdid')){
				for(var key in obj){
					$("#"+key).html(data[key])
				}
        $("#imgg").attr("src","/uploads/"+data.stdid+data.type);
			 
      }
		}	
	})
})