// server.js

// modules
var express = require('express');
var app = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

// configuration
var db = require('./config/database');
mongoose.connect(db.url);
//app.use(express.static(__dirname + '/public'));
//var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
//var routes =require('./app/routes');

// add from 
// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

// routes ==================================================
//var router = express.Router(); 
require('./app/routes')(app); 
//app.use('/api',router);
// end adding

// routes(app);
//
// Start web at localhost:3000
app.listen(port);

// report server running

console.log('Magic happens on port ' + port);

// expose app
exports = module.exports=app;


