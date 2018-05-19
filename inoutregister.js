var express= require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;
var socket = require('socket.io');
const mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';

module.exports = {
	IN : function (id,date,time,expected,res,io) {
		checkforlate(date,expected,id,time,io);
		mongo.connect(mongourl,function(err,db){
				var collection  = db.collection("inoutregister");
					collection.update( {stdid : id},{ $set : { "status" : "IN" , 'time' : time , 'date' : date, 'night' : 'false', 'return' : "" } } ,function(){
					res.send("OK");
				});

				var history = db.collection('history');
				history.update( { stdid : id }, { $push : { ara : { 'time' : time, 'date' : date, status : 'IN' } } }, {upsert : true},function(){

				});
		});



	
	},
	OUT : function(id,date,time,res,io){
		mongo.connect(mongourl,function(err,db){
				var collection  = db.collection("inoutregister");
					collection.update( {stdid : id},{ $set : { "status" : "EXIT" , 'time' : time , 'date' : date, 'night' : 'false', 'return' : date } } ,function(){
					res.send("OK");
				});
				var history = db.collection('history');
				history.update( { stdid : id }, { $push : { ara : { 'time' : time, 'date' : date, status : 'EXIT' } } }, {upsert : true},function(){

				});
		});		
	},
	NIGHTSTAY: function(id,date,time,returndate,res){
		console.log(returndate);
		mongo.connect(mongourl,function(err,db){
				var collection  = db.collection("inoutregister");
					collection.update( {stdid : id},{ $set : { "status" : "EXIT" , 'time' : time , 'date' : date, 'night' : 'true', 'return' : returndate } } ,function(){
					res.send("OK");
				});
				var history = db.collection('history');
				history.update( { stdid : id }, { $push : { ara : { 'time' : time, 'date' : date, status : 'EXIT' } } }, {upsert : true},function(){

				});
		});	
	},

	report : function(res){
		rep(res);
	}


}


function checkforlate(date,expcteddate,id,time,io){
	//console.log(date+"   "+  expcteddate);
	var dddddd = date;
	var xxxxxx = expcteddate;
	var d1 = date.split('/');
	var m1 = d1[1];
	d1 = d1[0];

	var d2 = expcteddate.split('/');
	var m2 = d2[1];
	d2 = d2[0];
	console.log(new Date().getHours() );
	if(d1==d2 && m1==m2){
		if( new Date().getHours() >=20){
			late(id,dddddd,xxxxxx,time,io);
		}
	}
	
	else if(m1 > m2){
		late(id,dddddd,xxxxxx,time,io);
	}
	else if(d1 > d2 && m1==m2){
		late(id,dddddd,xxxxxx,time,io);
	}

}


function late(id,date,expcteddate,time,io){
	//console.log('late');
	
	io.sockets.emit("late","you are dommed");

	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('lates');
		collection.update( { 'id' : id }, { $inc : { 'count' : 1 } },function(){
			
		});

		var col = db.collection('lastmonth');
		col.insert(  { "id" : id , "expected" : expcteddate, 'date' : date , "time" : time } ,function(){

		});

	})
}

function rep(res){
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('lastmonth');
		collection.find( {}).toArray(function(err,documents){
			var ids= [];
			var objara = [];
			for(var i =  0 ; i<documents.length;i++){
				objara.push( { 'id' : documents[i].id , 'expected' : documents[i].expected , 'date' : documents[i].date, 'time' : documents[i].time});
				if(ids.indexOf(documents[i].id)==-1)
					ids.push( documents[i].id );
			}
			console.log(ids);
			var col = db.collection('students');
			col.find( { 'stdid' : { $in : ids }  } ).toArray(function(err,docs){
				var obj = {};

				//console.log(docs);
				console.log(docs);

				for(var i  = 0; i< docs.length;i++){
					if( !obj.hasOwnProperty(docs[i].stdid) ){
						obj[ docs[i].stdid ] = {};
					}
					obj[ docs[i].stdid ]["name"] = docs[i].stdname;
					obj[ docs[i].stdid ]["crse"]= docs[i].crse;
					obj[ docs[i].stdid ]["level"] = docs[i].level;
					obj[ docs[i].stdid ]["room"] = docs[i].room;
					obj[ docs[i].stdid ]["hall"] = docs[i].hall;
				}

				console.log(obj);
				console.log(objara);

				for(var i = 0 ; i< objara.length;i++){
					objara[i]["name"] = obj[ objara[i].id ].name;
					objara[i]["crse"] = obj[ objara[i].id ].crse;
					objara[i]["level"] = obj[ objara[i].id ].level;
					objara[i]["room"] = obj[ objara[i].id ].room;
					objara[i]["hall"] = obj[ objara[i].id ].hall;
				}


				res.send(objara);

			});

		});
	});
}