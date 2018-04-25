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

	if(!req.body.uname || !req.body.psw || !req.body.type){
		res.send("invalid");
		return;
	}
	if(req.session.user){
		res.send(req.session.user);
		return;
	}
	loginauth.checkLogin(req.body.uname,req.body.psw,res,req,req.body.type);
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
			// console.log(link);
			MAILSENDER.sendM(req.body.email,res,"Password Reset",link);
		});

	});


});

app.post('/logout',function(req,res){
	req.session.destroy(function(err){
		if(!err)res.send("ok");
		else res.send("not ok");
	});
});


app.post("/guestform",function(req,res){
	var obj = {
		"stdname" : "",
		"stdphn"  : "",
		"grdnname": "",
		"grdnmail": "",
		"grdnphn" : "",
		"prsntaddr": "",
		"crse" 		: "",
		"stdid":"",
		"level":"",
		"reason":"",
		"from" : "",
		"to" : "",
	}
	for(var key in obj){
		if(req.body[""+key]===""){
			res.redirect("/guestform?insert=error");
		}
		obj[""+key] = req.body[""+key];
	}
	obj["Status"] = "Pending";


	mongo.connect(mongourl,function(err,db){
		var collection = db.collection("guestform");
		collection.insert( obj, function(err,data){
			res.redirect("/guestlists");
		});
	});

});



// get baby get


app.get('/application',function(req,res) {
	if(req.session.user==="manager")
		res.sendFile(process.cwd() + '/Views/application.html');
	else res.send("You Are not authorized to view this page");
});

app.get("/login",function(req,res){
	if(req.session.user){
		res.redirect("/"+req.session.user);
		return;
	}
	if(!req.query.auth){
		res.redirect("/auth");
		return;
	}
	if(req.query.auth=="dsw" || req.query.auth=="manager" || req.query.auth=="Ansar");
	else{
		res.redirect("/auth");
		return;
	}

	res.sendFile(process.cwd() + '/Views/login.html');
});
// app.get("/students",function(req,res){
// 	res.sendFile(process.cwd() + '/Views/table.html');
// });

app.get("/in-out",function(req,res){
	res.sendFile(process.cwd() + '/Views/table 2.html');
});
app.get("/residentstudent",function(req,res){
	if(req.session.user==="manager")
		res.sendFile(process.cwd() + '/Views/table.html');
	else res.send("You are not authorized to view this page");

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
		res.send("Not a Valid Url");
		return;
		
	}
	var code = req.query.code.split(" ");
	console.log(Number(code[0]) );
	if(code.length!==2  || !Number(code[0]) || !Number(code[1])){
		res.send("Not a Valid Url");
		return;
		
	}
	if(Date.now < Number(code[0]) ){
		res.send("Not a Valid Url");
		return;
	}
	if(Date.now()/100 - Number(code[0])/100 > 86400){
		res.send("Not a Valid Url");
		return;
	}


	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('auth');
		collection.find({ "hash" : code[1]+""}).toArray(function(err,documents){
			if(documents.length==1){
				res.sendFile(process.cwd()+'/Views/resetcode.html');
				
			}
			else res.send("not a valid url");

		});
	});
});

app.get("/pwreset",function(req,res){
	res.sendFile(process.cwd() + '/Views/passwordreset.html');
});

app.get("/dsw",function(req,res){
	if(req.session.user==="dsw")
		res.sendFile(process.cwd()+"/Views/provost.html");
	else res.redirect("/login?auth=dsw");
});
app.get("/auth",function(req,res){
	if(req.session.user){
		res.redirect("/login");
		return;
	}
	res.sendFile(process.cwd()+"/Views/auth.html");
});

app.get("/Ansar",function(req,res){
	if(req.session.user==="Ansar"){
		res.sendFile(process.cwd()+"/Views/ansar.html");
		return;
	}
	else res.redirect("/login?auth=Ansar");
});
app.get("/manager",function(req,res){
	if(req.session.user==="manager")
		res.sendFile(process.cwd()+"/Views/manager.html");
	else res.redirect("/login?auth=manager");
})

app.get("/guestform",function(req,res){
	res.sendFile(process.cwd()+"/Views/guestForm.html")
})

app.get("/guestprofile",function(req,res){
	res.sendFile(process.cwd()+"/Views/guestProfile.html")
})

app.listen(8080,function(){
	console.log('Port is listening');
});