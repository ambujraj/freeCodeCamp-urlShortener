'use strict';

var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var dns = require('dns');
var mongoose = require('mongoose');
mongoose.connect("mongodb://ambujraj:QwertyAmbuj143$@ds011281.mlab.com:11281/urlshortner", {useNewUrlEncoded: true});
var cors = require('cors');

var app = express();

// Basic Configuration 
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
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.post("/api/shorturl/new", function(req, res){
var url = req.query.url;
  var pattern = new RegExp('^(https?:\/\/)?'+ 
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+
    '((\d{1,3}\.){3}\d{1,3}))'+ 
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ 
    '(\?[;&a-z\d%_.~+=-]*)?'+ 
    '(\#[-a-z\d_]*)?$','i');
  if(!pattern.test(url)) {
    res.json({error: "invalid URL"});
  } else {
    var num=1;
    dns.lookup(url, function(err, address, family){
      if(!err){
      res.json({original_url: url, short_url: num});
        num++;
      }
      else{
       res.json({error: "invalid URL"});
      }
    });
    
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
