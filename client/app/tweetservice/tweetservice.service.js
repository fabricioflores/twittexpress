'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http, CONFIG, $websocket) {
    var ws;
    function init () {
        ws = $websocket.$new('ws://' + CONFIG.host + ':' + CONFIG.port);

        ws.$on('$open', function(){
            console.log('the websocket is opened');

            //TODO:
            // - emit a tweet list request to the server with
            //   no params
            // - store the tweets in a list of tweets1

        });

        ws.$on('$new_tweets', function(){
          //TODO
          // - pedir la lista de tweets o tal vez ya vienen como parametro?
        });
    }

    return {
        init: init,
        asyncSearch: function(query, since) {
            var data = {query: query};

            var queryUrl = '/search';
            var promise = $http.post(queryUrl, data).then(function (response) {
                return response;
            });
            return promise;
        }
    };
});
