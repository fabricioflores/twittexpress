'use strict';
/*jshint camelcase: false */

describe('Directive: notification', function () {

  // load the directive's module and view
  beforeEach(module('twittexpressApp'));
  beforeEach(module('app/notification/notification.html'));

  var element, scope, $rootScope, tweetservice, $timeout;

  beforeEach(inject(function (_$rootScope_, _tweetservice_, _$timeout_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    tweetservice = _tweetservice_;
    $timeout = _$timeout_;
  }));

  /*
  * Necesitamos que la notificacion se presente en el broadcas new_tweet
  * por x tiempo
  */
  it('should make respond to broadcast new_tweet', inject(function ($compile) {
    spyOn(scope, '$on').andCallThrough();
    element = angular.element('<div notification></div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(scope.$on).toHaveBeenCalled();
  }));

  /*
  * Necesitamos comprobar que cuando el brodcast sea llammado se fige el mensage
  * en la variable msg
  */
  // it('should set scope.msg', inject(function ($compile) {
  //   element = angular.element('<notification></notification>');
  //   element = $compile(element)(scope);
  //   scope.$apply();
  //   var tweet = {id: 123123, text: 'asdasd', user: {screen_name: '213123asd'}};
  //   tweetservice.processTweet(tweet);
  //   expect(scope.msg).not.toBeUndefined();
  //   expect(scope.msg).toEqual(tweet);
  // }));


  // * Necesitamos que la notificacion se vuelva null despues del tiempo del timeout

  // it('should reset scope.msg', inject(function ($compile) {
  //   element = angular.element('<notification></notification>');
  //   element = $compile(element)(scope);
  //   scope.$apply();
  //   var tweet = {id: 123123, text: 'asdasd', user: {screen_name: '213123asd'}};
  //   tweetservice.processTweet(tweet);
  //   $timeout.flush();
  //   expect(scope.msg).toBeNull();
  // }));
});
