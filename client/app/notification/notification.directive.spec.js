'use strict';

describe('Directive: notification', function () {

  // load the directive's module and view
  beforeEach(module('twittexpressApp'));
  beforeEach(module('app/notification/notification.html'));

  var element, scope, $rootScope, tweetservice;

  beforeEach(inject(function (_$rootScope_, _tweetservice_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    tweetservice = _tweetservice_;
  }));

  /*
  * Necesitamos que la notificacion se presente en el broadcas new_tweet
  * por x tiempo
  */
  it('should make hidden element visible', inject(function ($compile) {
    spyOn(scope, '$on').andCallThrough();
    element = angular.element('<notification></notification>');
    element = $compile(element)(scope);
    scope.$apply();
    var tweet = {id: 123123, text: 'asdasd', user: {screen_name: '213123asd'}};
    tweetservice.processTweet(tweet);
    expect(scope.$on).toHaveBeenCalled();
    //expect(element.text()).toBe('this is the notification directive');
  }));

});