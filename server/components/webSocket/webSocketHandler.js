'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;
var Configstore = require('configstore');
var pkg = require('../../../package.json');
var e;
var conf = new Configstore(pkg.name, {foo: 'bar'});
var Twit = require('twit');
var T = new Twit(config);
function zfill(num, len) {
    var t = new Array(len);
    return (t.join("0") + num).slice(-len);
}
var _ = require('lodash');
var clients=2;
var fs = require('fs');
module.exports = function(server){
  var wss = new WebSocketServer({ server: server });
  var T = new Twit(config);

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
  }

  var init = function(){
    var tweetlog = config.tweetlog || './tweets-log.json';

    connect(function(ws){
        loadTweets(tweetlog, function(_tweets_){
            tweets = _tweets_;

            var stream = T.stream('statuses/filter', {
                track: config.query || '@patovala'
            });

            stream.on('tweet', function(tweet) {
                console.log('debug:', tweet);
                // TODO save the tweet and try to deliver to the client
                ws.send(tweet, {mask: true});
            });

            ws.on('message', function incoming(message) {
                console.log('server:', message);

                switch(message) {
                    case 'case':
                        // code
                        console.log('mensaje recibido websocket abierto: %s', message);
                    for(var i in clients){
                        // Send a message to the client with the message
                        clients[i].sendUTF(JSON.stringify(server.config));
                    }
                    break;
                    case 'get_tweets':
                        ws.send(getTweets());
                    break;
                    case 'saveTweetsToDisks':
                        saveTweetsToDisk();
                    break;
                    default:
                        break;
                }
            });
        });
    });

  };

  var collectTweetsFromTwitter = function(query, callback){

  };

  // Guardar los tweets en el disco en un txt en algun lado que nos diga config.store
  var saveTweetsToDisk = function (){
  fs.writeFile('./tweets.txt', JSON.stringify(getTweets()), function(err) {
    conf.set('awesome', JSON.stringify(getTweets()));
    if( err ){
        console.log( err );
        e =false;
    }
    else{
        console.log(conf.get('awesome'));
        console.log('Se ha escrito correctamente');
        e = true;
    }
  })
    return e;
  };

  /* Get the last tweets for today */
  var getTweets = function(){
    // return tweets from today
    //1. get todays date
    var today = new Date();
    // filter tweets for today
    var tls = _.filter(tweets, function(i){
      var tldate = new Date(i.timestamp);
      return _.isEqual([tldate.getDate(), tldate.getFullYear(), tldate.getMonth()],
                       [today.getDate(), today.getFullYear(), today.getMonth()]);
    });

    return JSON.stringify(tls);
  };

  return {
    init: init,
    saveTweetsToDisk:saveTweetsToDisk,
    getConfig: function(){
      return config;
    }

  }

};
