/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 4444 });

wss.on('connection', function connection(ws) {

  var tweets = {
     "data": {
        "statuses":[
        {
          "id": 250075927172759561,
          "text": "text new tweet 1"
        },
        {
          "id": 250075927172759562,
          "text": "text new tweet 2"
        },
        {
          "id": 250075927172759563,
          "text": "text new tweet 3"
        },
        {
          "id": 250075927172759564,
          "text": "text new tweet 4"
        },
        {
          "id": 250075927172759565,
          "text": "text new tweet 5"
        },
        {
          "id": 250075927172759566,
          "text": "text new tweet 6"
        },
        {
          "id": 250075927172759567,
          "text": "text new tweet 7"
        },
        {
          "id": 250075927172759568,
          "text": "text new tweet 8"
        },
        {
          "id": 250075927172759569,
          "text": "text new tweet 9"
        },
        {
          "id": 250075927172759570,
          "text": "text new tweet 10"
        }
      ],
      "search_metadata":{
        "count": 10,
        "query": "%23freebandnames"
      }
    }
  }



  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  /*send tweets*/
  ws.send(JSON.stringify(tweets));

});

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
