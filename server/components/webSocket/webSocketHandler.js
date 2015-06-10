'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;
var portWS = config.webSocketPort;
var wss = new WebSocketServer({ port: portWS });

module.exports = function(){

  var init = function(callback){
    wss.on('connection', function connection(ws) {
      callback(ws);
    });
  };

  var onStartWS = function(tweets){
    init(function(ws){
      ws.on('message', function incoming(message) {

        console.log('server:',message);
        /*send tweets*/
        ws.send(JSON.stringify(tweets));
      });
    });
  };

  var sendTweets = function(tweets){
    init(function(ws){
      /*send tweets*/
      ws.send(JSON.stringify(tweets));
    });
  };


  return {
    onStartWS: onStartWS,
    sendTweets: sendTweets
  }

};
