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
	else{
		
		url = url[1].split("+errcode=");
		console.log(url);
		if(url.length!=2){
			return;
		}
		if(url[0]=="false"){
			if(url[1]=="404"){
				 	$.toast({
			    		heading: 'Error',
			    		text: 'Please Fillup All the Field',
			    		showHideTransition: 'fade',
			    		icon: 'error',
			    		 hideAfter : false,
					});
					return;
			}

			if(url[1]=="405"){
				 	$.toast({
			    		heading: 'Error',
			    		text: 'Please Upload Image',
			    		showHideTransition: 'fade',
			    		icon: 'error',
			    		 hideAfter : false,
					});
					return;
			}
			if(url[1]=="406"){
				 	$.toast({
			    		heading: 'Error',
			    		text: 'Somehting Went Wrong.Please try again',
			    		showHideTransition: 'fade',
			    		icon: 'error',
			    		 hideAfter : false,
					});
					return;
			}
			if(url[1]=="407"){
				 	$.toast({
			    		heading: 'Error',
			    		text: 'Student ID already Exist',
			    		showHideTransition: 'fade',
			    		icon: 'error',
			    		 hideAfter : false,
					});
					return;
			}
			if(url[1]=="408"){
				 	$.toast({
			    		heading: 'Error',
			    		text: 'Phone no is not Valid',
			    		showHideTransition: 'fade',
			    		icon: 'error',
			    		 hideAfter : false,
					});
					return;
			}
		}
	}
	// if(url[1]==='false'){
	// 	$.toast({
 //    		heading: 'Error',
 //    		text: 'Something is not right. Please try again',
 //    		showHideTransition: 'fade',
 //    		icon: 'error',
 //    		 hideAfter : false,
	// 	});
	// }
});