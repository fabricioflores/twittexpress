'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;
var pkg = require('../../../package.json');
var e;
var _ = require('lodash');
var clients=2;
var fs = require('fs');
var users = {wList: ['patovala','ingemurdok','darwingualito'], bList: ['ingemurdok']};

module.exports = function(server, wss){

  var tweets = [],
      stream;

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

  var init = function(_stream_){
    var tweetlog = config.tweetlog || './tweets-log.json';
    stream = _stream_;

    connect(function(){
        loadTweets(tweetlog, function(_tweets_){
            tweets = _tweets_;

            stream.on('tweet', function(tweet) {
              if (isAuthorized(tweet)){
                tweets.push(tweet);
                fs.writeFile(config.tweetlog || './tweets-log.json',
                    JSON.stringify(tweets), function(err) {
                    if( err ){
                        console.log( err );
                    }
                });
                wss.send(tweet, {mask: true});
              }else{
                console.log('DEBUG: no autorizado')
              }
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

  var isAuthorized = function(tweet){
    var uName = tweet.user.screen_name;

    if (_.contains(users.bList, '*')){
      return false;
    }else if(_.contains(users.bList, uName)){
      console.log('DEBUG: usuario ' + uName + ' no Autorizado')
      return false;
    }else if(_.contains(users.wList, '*')){
      return true;
    }else{
      return _.contains(users.wList, uName);
    }
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

  /* Set a new stream to get new queries */
  var setStream = function(s){
    stream = s;
  };

  return {
    init: init,
    getConfig: function(){
      return config;
    },
    setStream: setStream
  }

};
