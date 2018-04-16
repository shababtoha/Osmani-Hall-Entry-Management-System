$(document).ready(function(){
	var url = document.URL;
	url = url.split("?insert=");
	//console.log(url);
	if(url.length!=2){
		return;
	}
	if(url[1]==='true'){

		$.toast({
    		heading: 'Success',
    		text: 'Student Information added Successfully. click <a href="/residentstudent">here</a> to view',
    		showHideTransition: 'slide',
    		icon: 'success',
    		 hideAfter : false,
		});
	}
	if(url[1]==='false'){
		$.toast({
    		heading: 'Error',
    		text: 'Something is not right. Please try again',
    		showHideTransition: 'fade',
    		icon: 'error',
    		 hideAfter : false,
		});
	}
});