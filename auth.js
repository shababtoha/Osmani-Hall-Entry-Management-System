const  base = 31;
const  mod = 1000000007;

var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;
const mongourl =  'mongodb://osmani:osmani@ds131826.mlab.com:31826/osmanihall';

module.exports = {
  checkLogin : function(id,pass,res){
  	console.log(id,pass);
  	var val = hash(pass);
  	mongo.connect(mongourl,function(err,db){
  		if(err) console.log(err);
  		var collection = db.collection('auth');
  		collection.find({ email : id , pass : val+"" }).toArray(function(err,documents){
  			if(err) console.log(err);
  			console.log(documents);
  			if(documents.length == 1) res.redirect("/");
  			else res.send("invalid login");
  		});


  	});
  },
  getHash : function(val){
  	return hash(val);
  }
};

function hash(val) {
    val = val.split("");
    var hash_val = 0;
    for(var i = 0  ;i<val.length;i++){
    	hash_val = hash_val * base + val[i].charCodeAt(0);
    	hash_val%=mod;
    }
    return hash_val;
}