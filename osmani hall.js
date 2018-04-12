var express= require('express');
var app = express();
var loginauth = require("./auth");
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;
var mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer  = require('multer')
var upload = multer({ dest : 'uploads/' })
const fileUpload = require('express-fileupload');

var MAILSENDER = require("./sendMail");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Views'));
app.use(cookieParser());
app.use(session({secret: "Hey! Wanna Know my Secret Identity?",saveUninitialized : true,resave : false}));
app.use(fileUpload());

function checkValidPhone(x)
{
	if(x.length !=  11) return false;
	return true;
}


/// save student data to students collection
// app.post('/students',function (req, res) {
//       // if(req.file==undefined) res.json(  { size : 0 } );
//       // else{
//       // 	console.log(done);
//       // }
//       console.log(req.files.profile_photo);
//       console.log(req.body);
// });

app.post('/students',function(req,res){
	//console.log(req.body);
	if(!req.files){
		res.redirect('/application?insert=false');
		return;
	}
	if(!req.body){
		//console.log("hmm");
		res.redirect('/application?insert=false');
		return;
	}
	//console.log(req.files); mimetype  : image/png
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
  			console.log("key nai"+key);
  			res.redirect('/application?insert=false');
  			return;
  		}
  	}


	
  	var myfile = req.files.profile_photo;
  	var type = req.files.profile_photo.mimetype.split("/")[1];
	myfile.mv(process.cwd()+'/uploads/'+req.body.stdid+'.'+type, function(err) {
    	if(err) console.log("upload e error");
  	});


  	if(! (checkValidPhone(req.body.stdphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(req.body.gdphn))){
  		console.log("phone");
  		res.send("ERROR");
  		return;
  	}
  	mongo.connect(mongourl,function(err,db){
  		var collection  = db.collection('students');
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
	
	console.log(req.body);

	if(!req.body.uname || !req.body.psw){
		res.send("invalid");
		return;
	}
	if(req.session.user){
		res.send(req.session.user);
		return;
	}
	loginauth.checkLogin(req.body.uname,req.body.psw,res,req);
});

app.post("/resetpass",function(req,res){

	if(!req.body.email){
		//res.send("mara khao");
		return;
	}
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('auth');
		collection.find( { "email" : req.body.email } ).toArray(function(err,documents){
			if(documents.length !=1){
				res.send("notfound");
				return;
			}

			var link ="Please Use this link <br> http://localhost:8080/resetcode?code="+ Date.now()+"+"+documents[0].hash;
			//console.log(link);
			MAILSENDER.sendM(req.body.email,res,"Password Reset",link);
		});

	});


});



app.get('/application',function(req,res) {
	res.sendFile(process.cwd() + '/Views/application.html');
});

app.get("/login",function(req,res){
	if(req.session.user){
		res.redirect("/"+req.session.user);
		return;
	}
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

app.get("/resetcode",function(req,res){
	console.log(req.query.code);
	if(!req.query){
		res.send("Not a Valid Url");
		return;
	}
	if(!req.query.code){
		res.send("Not a Valid Url+s");
		return;
		
	}
	var code = req.query.code.split(" ");
	if(code.length!==2){
		res.send("Not a Valid Url+s");
		return;
		
	}
	if(Date.now < code[0] ){
		res.send("Not a Valid Url+s");
		return;
	}
	if(Date.now()/100 - Number(code[0])/100 > 86400){
		res.send("Not a Valid Url+s");
		return;
	}


	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('auth');
		collection.find({ "hash" : code[1]+""}).toArray(function(err,documents){
			if(documents.length==1){
				res.sendFile(process.cwd()+'/Views/resetcode.html');
			};
		});
	});
});

app.get("/pwreset",function(req,res){
	res.sendFile(process.cwd() + '/Views/passwordreset.html');
});

app.get("/dsw",function(req,res){
	if(req.session.user==="dsw")
		res.send("DSW er page banano hoynai :3");
	else res.redirect("/login");
});





app.listen(8080,function(){
	console.log('Port is listening');
});