'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;
var pkg = require('../../../package.json');
var e;
var _ = require('lodash');
var clients=2;
var fs = require('fs');

module.exports = function(server, wss){

  var tweets = [],
      stream,
      ws,
      acl = require('../../config/environment/' + config.appdata).users
              || {wList: [], bList: []};

  var connect = function(callback){
    wss.on('connection', function (_ws_) {
      ws = _ws_;
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

  var forwardTweet = function (tweet) {
      if (isAuthorized(tweet)){
          tweets.push(tweet);
          fs.writeFile(config.tweetlog || './tweets-log.json',
                      JSON.stringify(tweets), function(err) {
                        if( err ){
                          console.log( err );
                        }
                      });
                      ws.send(tweet, {mask: true});
      }else{
          console.log('DEBUG: no autorizado', tweet);
      }

  };

  var init = function(_stream_){
    var tweetlog = config.tweetlog || './tweets-log.json';
    stream = _stream_;

    connect(function(ws){
        loadTweets(tweetlog, function(_tweets_){
            tweets = _tweets_;

            stream.on('tweet', function(tweet) {
              forwardTweet(tweet);
            });

            wss.on('message', function incoming(message) {
                console.log('mensaje recibido websocket abierto: %s', message);
                if(message === 'get_tweets'){
                  ws.send(getTweets());
                }
            });
        });
    });

  };

  var isAuthorized = function(tweet){
      var uName;
      if (!tweet.user.screen_name){
          return false;
      }else{
          uName = tweet.user.screen_name;
      }

      if (_.contains(acl.bList, '*')){
        return false;
      }else if(_.contains(acl.bList, uName)){
        return false;
      }else if(_.contains(acl.wList, '*')){
        return true;
      }else{
        return _.contains(acl.wList, uName);
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

  var addWhiteListUser = function(u){
    acl.wList.push(u);
  };

  var removeWhiteListUser = function(u){
    acl.wList = _.remove(acl.wList, function(n){
      return n === u;
    });
  };

  var addBlackListUser = function(u){
    acl.bList.push(u);
  };

  var removeBlackListUser = function(u){
    acl.bList = _.remove(acl.bList, function(n){
      return n === u;
    });
  };

  var resetAcl = function(){
    acl = {wList: [], bList: []};
  };

  return {
    init: init,
    getConfig: function(){
      return config;
    },
    setStream: setStream,
    forwardTweet: forwardTweet,
    addBlackListUser: addBlackListUser,
    addWhiteListUser: addWhiteListUser,
    removeBlackListUser: removeBlackListUser,
    removeWhiteListUser: removeWhiteListUser,
    resetAcl: resetAcl,
  }

};
