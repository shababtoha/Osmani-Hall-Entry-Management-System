var express= require('express');
var app = express();
var nodemailer = require ('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
	sendM : function (email,res,sub,text){
		SEND(email,res,sub,text);
	},

};

function SEND(email,res,sub,txt) {
	var mailOptions = {
    	from: 'andro456project@gmail.com',
    	to: email,
    	subject: sub,
    	text: txt,
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
  
  
  	transporter.sendMail(mailOptions, (err, ress) => {
    	if (err) {
        	res.send(err);
    	} else {
        	console.log(JSON.stringify(ress));
    		res.send("Mail Sent");
    	}
	});
}