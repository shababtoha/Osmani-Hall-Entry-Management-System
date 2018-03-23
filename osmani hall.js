var express= require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Views'));



app.get('/',function(req,res) {
	//console.log("hm");
	res.sendFile(process.cwd() + '/Views/application.html');
});

app.get("/login",function(req,res){
	res.sendFile(process.cwd() + '/Views/login.html');
});

app.get("/showforms",function(req,res){
	res.sendFile(process.cwd() + '/Views/table.html');
});

app.get("/in-outReg",function(req,res){
	res.sendFile(process.cwd() + '/Views/table 2.html');
});

app.get("/mergeTable",function(req,res){
	res.sendFile(process.cwd() + '/Views/mergeTable.html');
});

app.get("/firstPage",function(req,res){
	res.sendFile(process.cwd() + '/Views/first page.html');
});

app.listen(3000,function(){
	console.log('Port is listening');
});