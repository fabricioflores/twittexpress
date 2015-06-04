'use strict';

describe('Service: tweetservice', function () {

  // load the service's module
  beforeEach(module('twittexpressApp'));

  // instantiate service
  var tweetservice;

  beforeEach(inject(function (_tweetservice_) {
    tweetservice = _tweetservice_;
  }));

  /*
   * deberia retornar una lista vacia de tweets
   * */
  iit('should return 0 tweets from the list', function() {
    //testing with empty
    var tweets = tweetservice.getTweets();
    expect(tweets.length).toBe(0);

  });

  /*
   * deberia agregar un tweet
   * */
  iit('should add tweets', function() {
    var tweet = {message: 'This is an empty tweet'};
    tweetservice.add(tweet);
    expect(tweetservice.getTweets().length).toBe(1);
  });

/*
  * deberia sacar el primer tweet de
  * la lista
  * */
 iit('should get first tweet', function() {
   var tweet1 = {
     id: 250075927172759561,
     text:'text new tweet 1'
   };    var tweet2 = {
     id: 250075927172759562,
     text:'text new tweet 2'
   };    var tweet3 = {
     id: 250075927172759563,
     text:'text new tweet 3'
   };    tweetservice.add(tweet1);
   tweetservice.add(tweet2);
   tweetservice.add(tweet3);    
   expect(tweetservice.first()).toEqual(tweet1); 
   expect(tweetservice.getTweets().length).toBe(2); 
 }); 


});

