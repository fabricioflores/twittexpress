'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;
var pkg = require('../../../package.json');
var e;
var _ = require('lodash');
var clients=2;
var fs = require('fs');

module.exports = function(server, wss){

  var tweets = [];

  var connect = function(callback){
    wss.on('connection', function (ws) {
      callback(ws);
    });
  };

  var loadTweets = function(filename, cb){
      fs.exists(filename, function(exists){
          if(exists){
              fs.readFile(filename, 'utf8', function(err, data) {
                  if (err){
                      console.log('ERROR!', err);
                      throw err;
                  }
                  cb(JSON.parse(data));
              });
          }
      });
  };

  var init = function(stream){
    var tweetlog = config.tweetlog || './tweets-log.json';

    connect(function(){
        loadTweets(tweetlog, function(_tweets_){
            tweets = _tweets_;

            stream.on('tweet', function(tweet) {
                tweets.push(tweet);
                fs.writeFile(config.tweetlog || './tweets-log.json',
                    JSON.stringify(tweets), function(err) {
                    if( err ){
                        console.log( err );
                    }
                });
                wss.send(tweet, {mask: true});
            });

            wss.on('message', function incoming(message) {
                console.log('mensaje recibido websocket abierto: %s', message);
                switch(message) {
                    case 'case':
                        // code
                        for(var i in clients){
                            // Send a message to the client with the message
                            clients[i].sendUTF(JSON.stringify(server.config));
                        }
                        break;

                    case 'get_tweets':
                        wss.send(getTweets());
                        break;

                    case 'saveTweetsToDisks':
                        break;

                    default:
                        break;
                }
            });
        });
    });

  };

  /* Get the last tweets for today */
  var getTweets = function(){
    // return tweets from today
    //1. get todays date
    var today = new Date();
    // filter tweets for today
    var tls = _.filter(tweets, function(i){
      if(!i || !i.timestamp) return false;

      var tldate = new Date(i.timestamp);
      return _.isEqual([tldate.getDate(), tldate.getFullYear(), tldate.getMonth()],
                       [today.getDate(), today.getFullYear(), today.getMonth()]);
    });

    return JSON.stringify(tls);
  };

  return {
    init: init,
    getConfig: function(){
      return config;
    }
  }

};
