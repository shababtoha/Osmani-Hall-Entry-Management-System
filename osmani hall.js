var express= require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Views'));



app.get('/application',function(req,res) {
	//console.log("hm");
	res.sendFile(process.cwd() + '/Views/application.html');
});

app.get("/login",function(req,res){
	res.sendFile(process.cwd() + '/Views/login.html');
});

app.get("/students",function(req,res){
	res.sendFile(process.cwd() + '/Views/table.html');
});

app.get("/in-out",function(req,res){
	res.sendFile(process.cwd() + '/Views/table 2.html');
});

app.get("/residentstudent",function(req,res){
	res.sendFile(process.cwd() + '/Views/mergeTable.html');
});

app.get("/",function(req,res){
	res.sendFile(process.cwd() + '/Views/first page.html');
});

app.get("/guest",function(req,res){
	res.sendFile(process.cwd() + '/Views/guestTable.html');
});

app.listen(3000,function(){
	console.log('Port is listening');
});