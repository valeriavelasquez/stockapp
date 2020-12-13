var express=require("express"); 
var request = require('request');
var http = require('http');
var adr = require('url');
var app = express();
var port = process.env.PORT || 3000;
//server stuff 
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var qobj =  adr.parse(req.url, true).query;
    var toGet = qobj.toGet;
    res.end("RESULTS WILL BE DISPLAYED IN THE TERMINAL FOR ENTRY: " + toGet);
    
//get onto mongo db 
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb+srv://valeriavelasquez:tomato@cluster0.bmsdw.mongodb.net/Stock?retryWrites=true&w=majority";
    
client =new MongoClient(mongourl,{ useUnifiedTopology: true });
async function findNames() {    
  try {
    await client.connect();
    var dbo = client.db("Stock");
	var coll = dbo.collection("Tickers");
    const options = {
        //sorting 
       sort: { Ticker: 1 },
       projection: { Company: 1, Ticker: 1 },
    };
      
    const curs = coll.find({ $or: [{Company: toGet}, {Ticker: toGet}]},options);
    //no docs found 
    if ((await curs.count()) === 0) {
      console.log("No documents found!");
    }
    //await curs.forEach(console.dir);
        
      //print to console 
	  await curs.forEach(function(item, res){
		  console.log("COMPANY NAME: " + item.Company + " " + "STOCK TICKER: " + item.Ticker);  
         });   
  } 
   
  catch(err) {
	  console.log("Database error: " + err);
}
  finally {
    client.close();
  }
}  //end doit
findNames();//.catch(console.dir);

}).listen(3000);





                                       
                      