'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http, CONFIG, $websocket) {
    var ws;
    var tls = [];

    function init () {
      ws = $websocket.$new({
        url: 'ws://' + CONFIG.host + ':' + CONFIG.port,
        mock: {
          openTimeout: 1,
          closeTimeout: 8000,
          messageInterval: 100,
          fixtures: {
            'get_initial_tweets': {
              data: [1,2,3]
            }
        }}
      });

      ws.$on('$open', function(){
          console.log('the websocket is opened');

          //TODO:
          // - emit a tweet list request to the server with
          ws.$emit('get_initial_tweets');
          //   no params
          // - store the tweets in a list of tweets1

      })

      ws.$on('get_initial_tweets', function(message){

        tls = message;

        ws.$emit('get_new_tweets',{
            data: [1,2,3,4,5,6,7,8,9,10]
        });

        //TODO
        // - pedir la lista de tweets o tal vez ya vienen como parametro?
      });

      ws.$on('get_new_tweets', function(message){
        tls = message.data;
      });

    }

    return {
        getWs: function(){ return ws;},
        init: init,
        asyncSearch: function(query, since) {
            var data = {query: query};

            var queryUrl = '/search';
            var promise = $http.post(queryUrl, data).then(function (response) {
                return response;
            });
            return promise;
        },
        getTweets: function(){ return tls;}
    };
});
