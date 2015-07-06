'use strict';
/* globals TimelineLite, Ease */

var app = angular.module('twittexpressApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngWebsocket'
])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
})
.constant('CONFIG', {
      host: 'localhost',
      port: '9000',
      maxTweets: 10
})
.constant('configuration',{
  'manifestUrl': '/api/pbshow' // where to get slides
})
.run(function($websocket, CONFIG){

  var ws;

  ws = $websocket.$new({
    url: 'ws://' + CONFIG.host + ':' + CONFIG.port,
  });

  ws.$on('$open', function(){
    console.log('the websocket is opened');
  });

  ws.$on('$message', function(message) {
    // tenemos un nuevo tweet
    console.log(message);
  });

});

app.animation('.slide-animation', function ($window) {
  return {
    enter: function (element, done) {
      var startPoint = $window.innerWidth * 0.5,
        tl = new TimelineLite();

      tl.fromTo(element.find('.bg'), 1, { alpha: 0}, {alpha: 1})
      .fromTo(element.find('.xlarge'), 1, { left: startPoint, alpha: 0}, {left: 50, alpha: 1, ease: Ease.easeInOut})
      .fromTo(element.find('.title'), 3, { left: startPoint, alpha: 0}, {left: 50, alpha: 1, ease: Ease.easeInOut})
      .fromTo(element.find('.subtitle'), 3, { left: startPoint, alpha: 0}, {left: 50, alpha: 1, ease: Ease.easeInOut, onComplete: done});

    },

    leave: function (element, done) {
      var tl = new TimelineLite();

      tl.to(element, 1, {alpha: 0, onComplete: done});
    }
  };
});
