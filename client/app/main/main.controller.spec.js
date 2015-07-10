'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('twittexpressApp'));

  var MainCtrl, scope, $controller, $timeout, tweetservice;

  var QueueServiceMock = {
    loadManifest: function(){},
    slides: function(){
      return [
        {id: 'image00', src: './images/image00.jpg', title: 'Our love',
          subtitle: 'will prove everyone wrong!'},
        {id: 'image01', src: './images/image01.jpg', title: 'Can you feel',
          subtitle: 'the love tonight!'},
        {id: 'image02', src: './images/image02.jpg', title: 'You are the wind',
          subtitle: 'beneath my wings'},
        {id: 'image03', src: './images/image03.jpg', title: 'Anything for you',
          subtitle: 'even accepting your family'},
        {id: 'image04', src: './images/image04.jpg', title: 'True love',
          subtitle: 'a dream within a dream'}];
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, $rootScope, _$timeout_, _tweetservice_, CONFIG) {

    scope = $rootScope.$new();
    $controller = _$controller_;
    $timeout = _$timeout_;
    tweetservice = _tweetservice_;

    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      QueueService: QueueServiceMock,
      CONFIG: CONFIG
    });
  }));

  it('should get a list of slides from the QueueService', function () {
    expect(scope.loaded).toBeFalsy();
    scope.$broadcast('queueComplete');

    expect(scope.loaded).toBeTruthy();
  });

  it('should move the progress on queueProgress', function () {
      scope.$broadcast('queueProgress', {progress: 1});

      expect(scope.progress).toBe(100);
  });

  it('should set loaded to true on queueComplete', function () {
      scope.$broadcast('queueComplete', QueueServiceMock.slides());

      expect(scope.loaded).toBe(true);
      expect(scope.slides.length).toBe(QueueServiceMock.slides().length);
  });

  it('should call the next slide if nextSlide is called', function () {
      scope.$broadcast('queueComplete', QueueServiceMock.slides());

      expect(scope.currentIndex).toBe(0);
      $timeout.flush();
      expect(scope.currentIndex).toBe(1);
  });
});
