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
          type : '',
 }

var _id = null;
$(document).ready(function(){
	//console.log( window.location.href);
	$("#maindiv").hide();

   _id = window.location.href.split('id=')[1];
	$.ajax({
		type : 'post',
		url  : '/getstudent',
		data : { 'id' : _id },
		success : function(data){
			console.log(data);
      $("#loading").remove();
      $("#maindiv").show();
      if(data.hasOwnProperty('stdid')){
				for(var key in obj){
          obj[key] = data[key];
					$("#"+key).html(data[key])
				}
        $("#imgg").attr("src","/uploads/"+data.stdid+data.type);
      }
		}	
	});
});
function edit(){
  if(!_id) return;
  for(var key in obj){
    if(key==='hall') $("#"+key).html(make_hall());
    else if(key==='gender') $("#"+key).html(make_g());
    else $("#"+key).html('<input type ="text" id="new'+key+'" value="'+ obj[key]+'">');
    
  }
  $("input").css({ 'border-color' : 'green'});
  $("input").css({ 'padding-left' : '2%'});
 // console.log(obj['hall']);
  $('.matha option[value="'+obj['hall']+'"]').attr("selected", true);
  $('.matha option[value="'+obj['gender']+'"]').attr("selected", true);
  $("#rjct").remove();
  $("#accpt").attr("onclick","save()");
  $("#accpt").html("Save");
    
}
function make_hall(){
  return '<select class="matha" name="hall"  style="width: 100%; color:#707b7c">\
       <option value="Osmani Hall">Osmani Hall</option> <!-- -_- eivabe -->\
        <option value="Extension A">Extension A</option>\
        <option value="Extension B">Extension B</option>\
        <option value="Extension C">Extension C</option>\
        <option value="Extension D">Extension D</option>\
        <option value="Extension E">Extension E</option>\
        <option value="Extension F">Extension F</option>\
       </select>';
}

function make_g(){
    return '<select class="matha" name="gender"  style="width: 100%; color:#707b7c">\
        <option value="Male">Male</option> <!-- -_- eivabe -->\
        <option value="Female">Female</option>\
       </select>';

}

function remove(){
  if(!_id) return;

  $.ajax({
      type : 'post',
      url  : '/deletestudent',
      data : { 'id' : _id,'stdid' : obj.stdid },
      success : function(data){
        console.log(data);
        if(data == "ok"){
          window.location.href = "/residentstudent"; 
        }
        else{
          alert("An Error Occured");
        }
      }
  });

}


function save(){
    if(!_id) return;
    for(var key in obj){
      if(key==="type") continue;
      obj[key] = $("#new"+key).val();
    }

    obj['hall'] = $('select[name=hall]').val();
    obj['gender'] = $('select[name=gender]').val();
    obj['id'] = _id;
    
    console.log(obj);

    $("#accpt").html('<i class="fa fa-spinner fa-spin"></i>');
    $.ajax({
      type :'post',
      url  : '/updateprofile',
      data : obj,
      success : function(data){
        console.log(data);
        //location.reload();
        if(data==="OK"){
          location.reload();
        }
      }
    });
}

