/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
var Twit = require('twit');
var T = new Twit(config);
var WebSocketServer = require('ws').Server;

var webSocketHandler = require('./components/webSocket/webSocketHandler'),
    stream;

var EventEmitter = require('events').EventEmitter;
var emiter = new EventEmitter();

server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));

  if (!config.testmode){

    stream = T.stream('statuses/filter', {
      track: config.query || '#ioetloja'
    });

    var wss = new WebSocketServer({ server: server });
    var wsh = webSocketHandler(server, wss);
    wsh.init(stream);
  }
});

emiter.on('reloadtweeter', function(){
  if (!config.testmode){
    stream = T.stream('statuses/filter', {
      track: config.query || '#ioetloja'
    });
  }
  console.log('stream restarted');
});


// Expose app
exports = module.exports = app;
module.exports.emiter = emiter;
