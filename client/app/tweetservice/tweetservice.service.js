'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http, CONFIG, $websocket) {
    var ws;
    var tweetList;
    var newTweetList;

    var init = function() {
      ws = $websocket.$new({
        url: 'ws://' + CONFIG.host + ':' + CONFIG.port,
        mock: {
          openTimeout     : 1,
          closeTimeout    : 100,
          messageInterval : 100,
          fixtures        : {
            'get_init_tweets' : {
              event:'init_tweets',
              data: {
                'statuses':[
                  {
                    "id": 250075927172759551,
                    "text": "text tweet 1"
                  },
                  {
                    "id": 250075927172759552,
                    "text": "text tweet 2"
                  },
                  {
                    "id": 250075927172759553,
                    "text": "text tweet 3"
                  },
                  {
                    "id": 250075927172759554,
                    "text": "text tweet 4"
                  },
                  {
                    "id": 250075927172759555,
                    "text": "text tweet 5"
                  },
                  {
                    "id": 250075927172759556,
                    "text": "text tweet 6"
                  },
                  {
                    "id": 250075927172759557,
                    "text": "text tweet 7"
                  },
                  {
                    "id": 250075927172759558,
                    "text": "text tweet 8"
                  },
                  {
                    "id": 250075927172759559,
                    "text": "text tweet 9"
                  },
                  {
                    "id": 250075927172759560,
                    "text": "text tweet 10"
                  }
                ],
                "search_metadata":{
                  "count": 10,
                  "query": "%23freebandnames"
                }
              }
            },
            'get_new_tweets'    : {
              event:'new_tweets',
              data: {
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
          }
        }
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

        newTweetList = message;

      });

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
