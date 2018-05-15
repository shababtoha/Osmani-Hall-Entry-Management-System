var express= require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;
const mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';

module.exports = {
	IN : function (id,date,time,expected,res) {
		checkforlate(date,expected,id,time);
		mongo.connect(mongourl,function(err,db){
				var collection  = db.collection("inoutregister");
					collection.update( {stdid : id},{ $set : { "status" : "IN" , 'time' : time , 'date' : date, 'night' : 'false', 'return' : "" } } ,function(){
					res.send("OK");
				});
		});
	
	},
	OUT : function(id,date,time,res){
		mongo.connect(mongourl,function(err,db){
				var collection  = db.collection("inoutregister");
					collection.update( {stdid : id},{ $set : { "status" : "EXIT" , 'time' : time , 'date' : date, 'night' : 'false', 'return' : date } } ,function(){
					res.send("OK");
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
		});	
	},

	report : function(res){
		rep(res);
	}


}


function checkforlate(date,expcteddate,id,time){
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
			late(id,dddddd,xxxxxx,time);
		}
	}
	
	else if(m1 > m2){
		late(id,dddddd,xxxxxx,time);
	}
	else if(d1 > d2 && m1==m2){
		late(id,dddddd,xxxxxx,time);
	}

}


function late(id,date,expcteddate,time){
	console.log('late');
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
			var obj = {};
			for(var i =  0 ; i<documents.length;i++){
				obj[ documents[i].id ] = { 'id' : documents[i].id , 'expected' : documents[i].expected , 'date' : documents[i].date, 'time' : documents[i].time}
				ids.push( documents[i].id );
			}
			var col = db.collection('students');
			col.find( { 'stdid' : { $in : ids }  } ).toArray(function(err,docs){
				for(var i  = 0; i< docs.length;i++){
					obj[ docs[i].stdid ]["name"] = docs[i].stdname;
					obj[ docs[i].stdid ]["crse"]= docs[i].crse;
					obj[ docs[i].stdid ]["level"] = docs[i].level;
					obj[ docs[i].stdid ]["room"] = docs[i].room;
					obj[ docs[i].stdid ]["hall"] = docs[i].hall;
				}
				res.send(obj);
			});

		});
	});
}