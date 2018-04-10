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
    	from: 'andro456project@gmail.com',
    	to: email,
    	subject: sub,
    	text: 'sample text',
    	html: txt,
	};


	var transporter = nodemailer.createTransport(smtpTransport({
  		service: 'gmail',
  		host: 'smtp.gmail.com',
  		auth: {
    		user: 'andro456project@gmail.com',
    		pass: 'androidProject1234'
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