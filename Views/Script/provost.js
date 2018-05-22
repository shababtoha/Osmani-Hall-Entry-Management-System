$(document).ready(function(){
	//console.log("aise");
	

})
var socket = io.connect('/');

socket.on('newguest',function(data){
	$.toast({
	    heading: 'Information',
	    text: '<a href ="/guestlist"> New Guest Request </a>',
	    icon: 'info',
	    loader: true,        // Change it to false to disable loader
	    loaderBg: '#9EC600'  // To change the background
	});
})

