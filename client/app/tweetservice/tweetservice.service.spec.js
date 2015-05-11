'use strict';

describe('Service: tweetservice', function () {

  // load the service's module
  beforeEach(module('twittexpressApp'));

  // instantiate service
  var tweetservice, $httpBackend;
  beforeEach(inject(function (_tweetservice_, _$httpBackend_) {
    tweetservice = _tweetservice_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
  });
  /*
   * This service should poll the server each n time to check
   * if it has new twitts for today
   * */
  it('should poll a server', function () {
    var ts;
    tweetservice.asyncSearch('algo').then(
      function(response){
        ts = response.data;
      }
    );
    $httpBackend.expectPOST('/search')
          .respond(200, []);
    $httpBackend.flush();

    expect(ts.length).toBe(0);
  });

});
