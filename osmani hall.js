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
var socket = require('socket.io');

var MAILSENDER = require("./sendMail");
var inoutregister = require('./inoutregister');



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

app.post("/loggedin",function(req,res){
	if(!req.session.user) res.send("err");
	else res.send(req.session.user);
});

app.post('/students',function(req,res){
	//console.log(req.body);
	//console.log(req.files);
	if(!req.files.profile_photo){
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
  		obj[key] = req.body[key];
  	}


	
  	var myfile = req.files.profile_photo;
  	var type = req.files.profile_photo.mimetype.split("/")[1];
  	obj["type"] = "."+type;
	myfile.mv(process.cwd()+'/Views/uploads/'+req.body.stdid+'.'+type, function(err) {
    	if(err) console.log("upload e error");
  	});


  	if(! (checkValidPhone(req.body.stdphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(req.body.fatphn) || checkValidPhone(req.body.gdphn))){
  		console.log("phone");
  		res.send("ERROR");
  		return;
  	}

  	mongo.connect(mongourl,function(err,db){
  		var collection = db.collection("students");
  		collection.find( { "stdid" : obj.stdid } ).toArray(function(err,documents){
  			if(err){
  				res.redirect('/application?insert=false');
  			}
  			else if(documents.length  ==  0){
  				collection.insert(obj, function(err,data){
  					if(err){
  						res.redirect('/application?insert=false');
  					}
  					else res.redirect('application?insert=true');
  				});

  				var col = db.collection('lates');
  				col.insert( { 'id' : obj.stdid , 'count' : 0 },function(){

  				});
  				col = db.collection('inoutregister');
  				col.insert( {  "status": "EXIT","name": obj.stdname,"stdid": obj.stdid,"time": "","date": "01/01/2040","night": "","return" : "31/12/2040" },function(){

  				});
  				var tt = db.collection('history');
  				tt.insert( { 'stdid' : obj.stdid , 'ara' : []},function(){

  				});


  			}
  			else{
  				res.redirect('/application?insert=false');
  			}
  		});
  	});


  	mongo.connect(mongourl,function(err,db){
  		var collection  = db.collection('students');
  		
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
		"gender" : "",
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
			res.redirect("/approvedguest");
		});
	});

});

app.post("/gueststatus",function(req,res){
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection("guestform");
		collection.find({},{ stdphn : false, grdnname : false, grdnmail : false,prsntaddr:false,reason : false,grdnphn : false}).toArray(function(err,documents){
			console.log(documents);
			res.send(documents);
		});
	});
});


app.post("/nextguest",function(req,res){
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection("guestform");
		collection.find({"Status" : "Pending"}).toArray(function(err,documents){
			//console.log(documents);
			if(documents.length > 0)
				io.sockets.emit("next",documents[0]);
			else  io.sockets.emit("next","nai");
			res.send("ok");
		});
	})
});

app.post("/chagegueststatus",function(req,res){
		

	mongo.connect(mongourl,function(err,db){
		var collection = db.collection("guestform");
		var s;
		if(req.body.status=="0") s= "Rejected";
		else if(req.body.status=="1") s= "Approved";
		collection.update( { _id : ObjectId(req.body.id) } , { $set : { "Status" : s } }, function(){
			//console.log(arguments[0]);
			collection.find({"Status" : "Pending"}).toArray(function(err,documents){
				//console.log(documents);
				if(documents.length > 0)
					io.sockets.emit("next",documents[0]);
				else io.sockets.emit("next","nai");
				res.send("ok");
			});
		});
	})
})

app.post("/getstudent",function(req,res){
	if(req.session.user ==="manager" || req.session.user==="dsw"){

		if(!req.body.id){
			res.send("Not Found");
			return;
		}
		mongo.connect(mongourl,function(err,db){
			var collection = db.collection("students");
			collection.find( { _id : ObjectId(req.body.id)} ).toArray(function(err,documents){
				if(documents.length!=1){
					res.send("error");
					return;
				}
				res.send(documents[0]);
			});
		})
		
	}
	else res.send("Not uthorized");
});


app.post("/inoutstatus",function(req,res){
	if(!req.body.id){
		res.send("nai");
		return;
	}

	mongo.connect(mongourl,function(err,db){
		var collection = db.collection("inoutregister");
		collection.find( { "stdid" : req.body.id}).toArray(function(err,documents){
			if(documents.length != 1){
				res.send("err");
				return;
			}
			res.send(documents[0]);
		});
	});

});

app.post("/inoutsave",function(req,res){
	//console.log(req.body);

	if(!req.body.id  || !req.body.status || !req.body.time || !req.body.night || !req.body.date ){
		res.send("nai");
		return;
	}

	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('inoutregister');
		collection.find({ stdid : req.body.id}).toArray(function(errr,documents){
			if(errr ||  documents.length!=1){
				res.send("nai");
				return;
			}


			if(req.body.status==='IN'){
				inoutregister.IN(req.body.id, req.body.date,req.body.time,documents[0].return ,res,io);
			}
			else if(req.body.status==='EXIT'){
				if(req.body.night==='false'){
					inoutregister.OUT(req.body.id, req.body.date,req.body.time,res,io);
				}
				else if(req.body.night==="true"){
					inoutregister.NIGHTSTAY(req.body.id, req.body.date,req.body.time,req.body.return,res,io);
				}
				else res.send("err");
			}	
			else{
				res.send("err");
			}
		});
	});


	

	// mongo.connect(mongourl,function(err,db){
	// 	var collection  = db.collection("inoutregister");
	// 	collection.update( {stdid : req.body.id},{ $set : { "status" : req.body.status } } ,function(){
	// 		res.send("OK");
	// 	});
	// });
});

app.post("/updateprofile",function(req,res){
	


	if(req.session.user!="manager"){
		res.send("yeah?");
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
 	console.log(req.body);
 	for(var key in obj){
  		if(req.body[key]=="" || !req.body[key]){
  			res.send("err");
  			return;
  		}
  		obj[key] = req.body[key];
  	}
  	mongo.connect(mongourl,function(err,db){
  		var  collection = db.collection('students');
  		collection.update( { _id : ObjectId(req.body.id) }, obj, {upsert : true }, function(){
  			res.send("OK");
  		});
  	});


});

app.post("/deletestudent",function(req,res){
	if(!req.body.id){
		res.send("err");
		return;
	}
	if(req.session.user!="manager"){
		res.send("err");
		return;
	}
	console.log(req.body.id);
	mongo.connect(mongourl,function(err,db){
		if(err){
			res.send("err");
			return;
		}
		var collection = db.collection('students');
		collection.remove({ _id : ObjectId(req.body.id)} , function(){
			res.send("ok");
			return;
		});
		var id = req.body.stdid;
		var inout = db.collection('inoutregister');
		inout.remove( {'stdid' : id},function(){

		});
		var lm = db.collection('lastmonth');
		lm.remove({'id' : id},function(){

		});
		var la = db.collection('lates');
		la.remove( { 'id' : id},function(req,res){
			
		});


	})

});


app.post("/entry",function(req,res){
	 mongo.connect(mongourl,function(err,db){
	 	var collection = db.collection('inoutregister');
	 	console.log("here");
	 	if(err) console.log(err);
	 	collection.find( { 'status' : 'EXIT' } ).toArray(function(err,documents){
	 		var ids = [];
	 		var obj= {};
	 		for(var i = 0 ; i<documents.length;i++){
	 			ids.push(documents[i].stdid);
	 			obj[ documents[i].stdid] = { "stdid" : documents[i].stdid, "return" : documents[i].return , "time" : documents[i].time, "date" : documents[i].date, "name" : documents[i].name };
	 		}
	 		console.log(ids);
	 		var col = db.collection('students');
	 		col.find( { stdid : { $in : ids } } ).toArray(function(err,docs){
	 			for(var i = 0 ; i<docs.length;i++){
	 				obj[ docs[i].stdid ]["crse"] = docs[i].crse;
	 				obj[ docs[i].stdid ]["level"] = docs[i].level;
	 				obj[ docs[i].stdid ]["room"] = docs[i].room;
	 				obj[ docs[i].stdid ]["hall"] = docs[i].hall;
	 				obj[ docs[i].stdid ]["gender"] = docs[i].gender;
	 			}
	 			res.send(obj);
	 		});


	 	});
	 });
});


app.post("/getblacklist",function(req,res){
	if(req.session.user === "manager" || req.session.user === "dsw"){
		mongo.connect(mongourl,function(err,db){
			var collection = db.collection("students");
			collection.find({}).toArray(function(err,documents){
				var data = {};
				for(var i = 0 ; i<documents.length ;i++){
					data[ documents[i].stdid ] = { "stdid" : documents[i].stdid, "crse" : documents[i].crse , "name" : documents[i].stdname,"room" : documents[i].room, "hall" : documents[i].hall, "gender" : documents[i].gender , "contact" : documents[i].fatphn,'level': documents[i].level, '_id' : documents[i]._id  }
				}
				var col = db.collection('lates');
				col.find({}).toArray(function(err,doc){
					for(var i = 0 ; i<doc.length ;i++){
						if(data.hasOwnProperty(doc[i].id)){
							data[ doc[i].id ]["late"] = doc[i].count;
						}
					}
					res.send(data);
				});

			});

		});
	}
	else res.send("unauthorized");
});


app.post("/getreport",function(req,res){
	inoutregister.report(res);
});


app.post("/newpassword",function(req,res){
	var hash = req.body.code;
	var pass = req.body.pass;
	console.log(hash+"   "+pass);
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('auth');
		collection.find({ "hash" : hash  }).toArray(function(err,documents){
			if(documents.length!=1){
				res.send("err");
				return;
			}
			else{
				var newhash = loginauth.getHash(documents[0].email+pass );
				var newpass = loginauth.getHash(pass);
				console.log(newpass);
				collection.update( { 'hash' :hash },{ $set : { 'hash' : newhash+"" , 'pass' : newpass+"" } },function(){
					res.send('success');
				});
			}
		});
	})
});

app.post('/search',function(req,res){
	console.log(req.query.value);
	if(!req.query.value){
		res.send("err");
		return;
	}

	mongo.connect(mongourl,function(err,db){
		// var collection = db.collection("history");
		// collection.find( { stdid : req.query.value} ).toArray(function(err,documents){
		// 	if(documents.length==0){
		// 		res.send("nai");
		// 		return;
		// 	}
		// 	var ara = documents[0].ara;
		// 	ara.reverse();
		// 	res.send(ara);

		// });
		var col = db.collection('students');
		col.find( { stdid : req.query.value } ).toArray(function(err,doc){
			if(doc.length != 1){
				res.send("nai");
				return;
			}
			var collection = db.collection("history");
				collection.find( { stdid : req.query.value} ).toArray(function(err,documents){
					if(documents.length==0){
						res.send("nai");
						return;
					}
					var ara = documents[0].ara;
					ara.reverse();
					res.send( { name  : doc[0].stdname, id : documents[0].stdid, 'history' : ara } );
				});


		})

	});	

});


// get  get


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
	console.log(code[1]);

	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('auth');
		collection.find({ "hash" : code[1]+""}).toArray(function(err,documents){
			//console.log(code[1]+"");
			if(documents.length==1){
				res.sendFile(process.cwd()+'/Views/resetcode.html');
			}
			else{
				console.log("SIZE" + documents.length);
				res.send("not a valid url");
			}
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

app.get("/approvedguest",function(req,res){
	res.sendFile(process.cwd()+"/Views/approvedGuest.html")
})

app.get("/contact",function(req,res){
	res.sendFile(process.cwd()+"/Views/contact.html")
})
var server = app.listen(8080,function(){
	console.log('Port is listening');

	initjob();
});

app.get("/guestlist",function(req,res){
	if(req.session.user==="dsw"){
		res.sendFile(process.cwd()+"/Views/guestProfile.html");
	}
	else res.redirect("/login?auth=dsw");
});

app.get("/studentprofile",function(req,res){
	if(req.session.user==="dsw" || req.session.user==="manager")
		res.sendFile(process.cwd()+"/Views/studentProfile.html");
	else res.send("File Dewa Jabe na");
})

app.get("/entrylist",function(req,res){
	res.sendFile(process.cwd() + '/Views/mergeTable.html');
});

app.get("/blacklist",function(req,res){
	if(req.session.user==="dsw" || req.session.user === "manager")
		res.sendFile(process.cwd() + '/Views/blacklist.html');
	else res.send("meh :3")
});

app.get("/report",function(req,res){
	if(req.session.user==="dsw" || req.session.user === "manager")
		res.sendFile(process.cwd() + '/Views/report.html');
	else res.send("MEH");
});


app.get('/guests',function(req,res){
	if(req.session.user=="Ansar" || req.session.user==="manager" || require.session==="dsw"){
		res.sendFile(process.cwd() + "/Views/guest.html");
	}
});

var io = socket(server);
io.on('connection', function(socket){
	//console.log(socket);
	console.log('made socket connection with '+socket.id);
	socket.on('disconnect', function(){
		console.log("disconnect "+socket.id);
	});
});


app.get("/search",function(req,res){
	res.sendFile(process.cwd() + '/Views/studentSearch.html');
});


function initjob(){

	var schedule = require('node-schedule');
	 
	var rule = new schedule.RecurrenceRule();
	rule.minute = 5;
 	console.log("started job");
	var j = schedule.scheduleJob(rule, function(){
  		console.log('The answer to life, the universe, and everything!');
	});

}