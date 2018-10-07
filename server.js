'use strict';

var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var dns = require('dns');
var mongoose = require('mongoose');
mongoose.connect("mongodb://ambujraj:QwertyAmbuj143$@ds011281.mlab.com:11281/urlshortner", {useNewUrlEncoded: true});
var cors = require('cors');
var app = express();
var num;

var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extension: true}));
app.use('/public', express.static(process.cwd() + '/public'));
var urlSchema = new mongoose.Schema({
url: {type: String, required: true},
short: {type: Number, default: 1}
});
var Url  = mongoose.model("Url", urlSchema);
Url.find({}, function(err, data){
if(err){
  console.log("ERROR!!");
}
  else{
  num = data.short || 1;}
});
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.post("/api/shorturl/new", function(req, res){
var url = req.body.url.toString();
  if(url.includes('https://')) {
     var ab = dns.lookup(url, function(err, address, family){
      if(!address){
      res.json({original_url: url, short_url: num});
      num=num+1;
      Url.create({short: num, url: url});
      }
      else{
       res.json({error: "invalid URL"});
      }
    });
    
  } else {
    res.json({error: "invalid URL"});
  }
});
app.post("/api/shorturl/:b", function(req, res){
  var b1 = req.params.b;
  Url.find({}, function(err, data){
    data.forEach(function(dd){
       if(dd.short==b1){
         res.redirect(dd.url);
       }
    });
  });
  
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});
