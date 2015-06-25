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

var webSocketHandler = require('./components/webSocket/webSocketHandler');

server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  var stream = T.stream('statuses/filter', {
          track: config.query || '#ioetloja'
  });

  var wss = new WebSocketServer({ server: server });
  var wsh = webSocketHandler(server, wss);
  wsh.init(stream);
});


// Expose app
exports = module.exports = app;
