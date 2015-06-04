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

});

