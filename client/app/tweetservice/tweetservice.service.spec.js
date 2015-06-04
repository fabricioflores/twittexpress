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
  iit('should remove ultimate tweet', function() {
    var tweet = {message: 'This is an empty tweet'};
    var tweet1 = {message: 'This is an empty tweet1'};
    //var aux=tweetservice.getTweets().length;
    tweetservice.add(tweet);
    tweetservice.add(tweet1);
    expect(tweetservice.pop()).toEqual(tweet1);

  });
  /*
  * deberia retornar lista vacia de tweets luego de usar la funcion de borrarlos todos
  * */
 iit('should return a empty list of tweets', function() {
   //testing with empty
   var tweets = tweetservice.removeAll();
   expect(tweets.length).toBe(0);

 });
});

