/*
 * Tweetservice: this is just a holder for tweets, allows storage and easy retrival
 * of tweets across the application. Should issue a broadcast when new tweets are
 * added to it
 * */
'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http, CONFIG, $websocket) {

    var tls = [];

    function add(tweet) {

    }

    function pop(argument) {

    }

    function removeAll (argument) {
        tls = [];
        return tls;
    }

    function getTweets(argument) {

    }

    function first (argument) {
      // body...
    }

    return {
        add: add,
        pop: pop,
        first: first,
        removeAll: removeAll,
        getTweets: function(){ return tls;}
    };
});
