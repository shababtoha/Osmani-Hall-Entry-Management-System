var express= require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;
const mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';

module.exports = {
	IN : function (id,date,time,expected,res) {
		checkforlate(date,expected,id);
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
	}

}


function checkforlate(date,expcteddate,id){
	//console.log(date+"   "+  expcteddate);
	var d1 = date.split('/');
	var m1 = d1[1];
	d1 = d1[0];

	var d2 = expcteddate.split('/');
	var m2 = d2[1];
	d2 = d2[0];

	if(d1==d2 && m1==m2){
		if( new Date().getHours() >=20){
			late(id);
		}
	}
	
	else if(m1 > m2){
		late(id);
	}
	else if(d1 > d2 && m1==m2){
		late(id);
	}

}


function late(id){
	console.log('late');
	mongo.connect(mongourl,function(err,db){
		var collection = db.collection('lates');
		collection.find( { 'id' : id }).toArray(function(err,documents){
			var x =  Number(documents[0].count)+1;
			collection.update({ 'id' : id },{$set : { 'count' : x }  },function(){
				
			});
		});
	})
}