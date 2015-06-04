'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http, CONFIG, $websocket) {
    var ws;
    var tweetList;
    var newTweetList;

    var init = function(mockConf) {

      if(!mockConf){
        mockConf = false;
      }

      ws = $websocket.$new({
        url: 'ws://' + CONFIG.host + ':' + CONFIG.port,
        mock: mockConf
      });

      ws.$on('$open', function(){
          console.log('the websocket is opened');
          ws.$emit('get_init_tweets');
          //TODO:
          // - emit a tweet list request to the server with
          //   no params
          // - store the tweets in a list of tweets1

      });

      ws.$on('init_tweets', function(message){
        tweetList = message;
        ws.$emit('get_new_tweets');

        //TODO
        // - pedir la lista de tweets o tal vez ya vienen como parametro?
      });

      ws.$on('new_tweets', function(message){
        console.log('debug: ', message);
        newTweetList = message;

      });

      ws.$on('tweet',function(message){
        console.log(message);
      })

    };

    var getWs = function(){
      return ws;
    };

    var getTweets = function(){
      return tweetList;
    };

    var getNewTweets = function(){
      return newTweetList;
    };

    return {
        getWs : getWs,
        init : init,
        getTweets : getTweets,
        getNewTweets:getNewTweets
    };
});
