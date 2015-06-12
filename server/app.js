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
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
var ws = require('./components/webSocket/webSocketHandler')(server);

ws.init({data:'dato1',data2:'dato2'});

require('./config/express')(app);
require('./routes')(app);

// Start server


// Expose app
exports = module.exports = app;
