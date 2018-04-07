var express= require('express');
var app = express();
var loginauth = require("./auth");


var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var mongo = require('mongodb').MongoClient;
var  mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Views'));

function checkValidPhone(x)
{
	if(x.length !=  11) return false;
	return true;
}


/// save student data to students collection

app.post('/students',function(req,res){

	//console.log(req.body);
	if(!req.body){
		console.log("hmm");
		res.redirect('/application?insert=false');
		return;
	}
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

  	for(var key in obj){
  		if(!req.body.hasOwnProperty(key)){
  			console.log("key nai");
  			res.redirect('/application?insert=false');
  			return;
  		}
  	}
  	if(! (checkValidPhone(req.body.stdphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(gdphn))){
  		console.log("phone");
  		res.send("ERROR");
  		return;
  	}
  	mongo.connect(mongourl,function(err,db){
  		var collection  = db.collection('students');
  		console.log(collection);
  		collection.insert( req.body, function(err,data){
  			if(err){
  				res.redirect('/application?insert=false');
  			}
  			res.redirect('application?insert=true');
  		});
  	});

});

///save data to studens collection ends 

///fetching data for table.html


		//room no kora baki ase
app.post("/getstudentinfo",function(req,res){
	mongo.connect(mongourl,function(err,db){
		if(err){
			console.log(err);
			return;
		}

		var collection = db.collection("students");

		collection.find({}).toArray(function(err,documents){
			if(err){
				res.send("err");
				return;
			}
			var obj = [];
			for(var i = 0 ; i<documents.length;i++){
				obj.push( { "name" : documents[i].stdname, "course" : documents[i].crse , "level" : documents[i].level ,
				"id" : documents[i]._id,
				"stdid" : documents[i].stdid,
				"gender" : documents[i].gender,
				"contact" : documents[i].stdphn,
				"room" : documents[i].room
				 });
			}
			res.send(obj);
		});
	});
});

//fetching dara ends here
app.post('/login',function(req,res){
	if(!req.body.uname || !req.body.psw){
		res.send("invalid");
		return;
	}
	loginauth.checkLogin(req.body.uname,req.body.psw,res);
});




app.get('/application',function(req,res) {
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

app.get("/dsw",function(req,res){
	res.send("DSW er page banano hoynai :3");
});

app.listen(8080,function(){
	console.log('Port is listening');
});