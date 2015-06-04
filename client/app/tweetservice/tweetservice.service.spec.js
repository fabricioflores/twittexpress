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
  it('should return 0 tweets from the list', function() {
    //testing with empty
    var tweets = tweetservice.getTweets();
    expect(tweets.length).toBe(0);

  });

  /*
   * deberia agregar un tweet
   * */
  it('should add tweets', function() {

    var tweet = {message: 'This is an empty tweet'};
    tweetservice.add(tweet);
    expect(tweetservice.getTweets().length).toBe(1);
  });
  /*
   * deberia retornar  el ultimo tweet
   * */
  it('should remove ultimate tweet', function() {
    var tweet = {message: 'This is an empty tweet'};
    var tweet1 = {message: 'This is an empty tweet1'};
    //var aux=tweetservice.getTweets().length;
    tweetservice.add(tweet);
    tweetservice.add(tweet1);
    expect(tweetservice.pop()).toEqual(tweet1);

 });
/*
  * deberia sacar el primer tweet de
  * la lista
  * */
 it('should get first tweet', function() {
   var tweet1 = {
     id: 250075927172759561,
     text:'text new tweet 1'
   };
   var tweet2 = {
     id: 250075927172759562,
     text:'text new tweet 2'
   };
   var tweet3 = {
     id: 250075927172759563,
     text:'text new tweet 3'
   };

   tweetservice.add(tweet1);
   tweetservice.add(tweet2);
   tweetservice.add(tweet3);

   expect(tweetservice.first()).toEqual(tweet1);
   expect(tweetservice.getTweets().length).toBe(2);
 });

  /*
  * deberia retornar lista vacia de tweets luego de usar la funcion de borrarlos todos
  * */
 it('should return a empty list of tweets', function() {
   //testing with empty
   var tweets = tweetservice.removeAll();
   expect(tweets.length).toBe(0);

 });
});

