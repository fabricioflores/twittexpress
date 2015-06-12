/*
 * Tweetservice: this is just a holder for tweets, allows storage and easy retrival
 * of tweets across the application. Should issue a broadcast when new tweets are
 * added to it
 * */
'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function () {

    var tls = [];

    function add(tweet) {
      tls.push(tweet);
    }

    function pop() {
        return tls.pop();
    }

    function removeAll () {
      tls = [];
       return tls;
    }

    function getTweets() {
        return tls;
    }

    function first () {
      return tls.shift();
    }

    return {
        add: add,
        pop: pop,
        first: first,
        removeAll: removeAll,
        getTweets: getTweets
    };
});
