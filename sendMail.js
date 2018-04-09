var express= require('express');
var app = express();
var nodemailer = require ('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
	sendM : function (email,hash,res,sub,text){
		SEND(email,hash,res,sub,text);
	},

};

function SEND(email,hash,res,sub,txt) {
	var mailOptions = {
    	from: 'shabab.toha@gmail.com',
    	to: 'stoha71@gmail.com',
    	subject: 'sample subject',
    	text: 'sample text',
    	html: '<b>sample html</b>',
	};


	var transporter = nodemailer.createTransport(smtpTransport({
  		service: 'gmail',
  		host: 'smtp.gmail.com',
  		auth: {
    		user: 'shabab.toha@gmail.com',
    		pass: ''
  		}
	}));
  
  
  	transporter.sendMail(mailOptions, (err, res) => {
    	if (err) {
        	return console.log(err);
    	} else {
        	console.log(JSON.stringify(res));
    	}
	});
}