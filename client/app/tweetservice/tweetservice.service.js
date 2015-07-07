/*
 * Tweetservice: this is just a holder for tweets, allows storage and easy retrival
 * of tweets across the application. Should issue a broadcast when new tweets are
 * added to it
 * */
'use strict';

angular.module('twittexpressApp')
.service('tweetservice', ['$rootScope', function ($rootScope) {

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

    /*
    * TODO: here we need to first, let the front end know we have a new tweet
    *       then queue the tweet into the slide list, check if the tweet has
    *       more info (picture) and add it to the slide
    * */

    function processTweet(tweet){
        // un tweet debe tener:
        // user, text, id...
        //TODO: el plan es si el tweet tiene una imagen se debe llamar al queueservice
        if (tweet.id && tweet.text && tweet.user){
            $rootScope.$broadcast('new_tweet', tweet);
            add(tweet);
            return true;
        }else{
            return false;
        }
    }

    return {
        add: add,
        pop: pop,
        first: first,
        removeAll: removeAll,
        getTweets: getTweets,
        processTweet: processTweet
    };
}]);
