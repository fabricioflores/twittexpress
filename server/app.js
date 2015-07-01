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
    stream,
    wsh;

var EventEmitter = require('events').EventEmitter;
var emiter = new EventEmitter();

server.listen(config.port, config.ip, function () {
  var env = app.get('env');
  console.log('Express server listening on %d, in %s mode', config.port, env);

  if (!config.testmode){
    stream = T.stream('statuses/filter', {
      track: config.query || '#ioetloja'
    });

    var wss = new WebSocketServer({ server: server });
    wsh = webSocketHandler(server, wss);
    wsh.init(stream);
  }
});

emiter.on('reloadtweeter', function(appdata){
  if (!config.testmode){
    stream = T.stream('statuses/filter', {
      track: appdata.query || '#ioetloja'
    });
    wsh.setStream(stream);
  }
  console.log('stream restarted');
});

emiter.on('updateacl', function(act){
  if(config.testmode){
    console.log('Warning: you are in test mode, provide credentials for tweeter');
    return;
  }

  if(act.list === 'whitelist'){
    if(act.action === 'add'){
      wsh.addWhiteListUser(act.user);
      console.log('acl updated');
    }
  }
});

// Expose app
exports = module.exports = app;
module.exports.emiter = emiter;
