'use strict';

describe('Service: tweetservice', function () {

  // load the service's module
  beforeEach(module('twittexpressApp'));

  // instantiate service
  var tweetservice, $websocket;

  beforeEach(inject(function (_tweetservice_, _$httpBackend_, _$websocket_) {
    $websocket = _$websocket_;
    tweetservice = _tweetservice_;
  }));

  /*
   * Deberia llamar al websocket service por defecto
   * */
  it('should set ws.$new on load', function() {
    spyOn($websocket, '$new').andCallThrough();
    tweetservice.init();
    expect($websocket.$new).toHaveBeenCalled();
  });

  /*
   * Deberia obtener una lista con n tweets si el
   * websocket tiene algo al levantarse osea $open
   * */
  it('should set ws.$new on load', function() {
    expect(false).toBeTruthy();
  });

  /*
   * We should have a list of tweets somewhere, empty at the begining
   * */
    it('should have a list of tweets', function() {
    expect(tweetservice.getTweets).toEqual([]);
  });

  /*
   * Si el websocket contesta $new_tweets, deberiamos
   * poder capturarlos y guardarlos en nuestra lista
   * de tweets
   * */
  it('should get tweets on $new_tweets', function() {
    expect(tweetservice.getTweets().length > 0).toBe(true);
  });

  /*
   * If the tweetservice has been configured to hold
   * 10 tweets, free the space and holds the new tweets
   * */
  it('should free the space if maxTweets', inject(function(CONFIG){
    expect(tweetservice.getTweets().length > CONFIG.maxTweets).toBe(true);
  }));
});
