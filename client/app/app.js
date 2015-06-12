'use strict';

angular.module('twittexpressApp', [
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
  .run(function($websocket, CONFIG){

    var ws;

    ws = $websocket.$new({
      url: 'ws://' + CONFIG.host + ':' + CONFIG.port,
    });

    ws.$on('$open', function(){
      console.log('the websocket is opened');

      ws.$emit('evento1','getTweets');

    });

    ws.$on('$message', function(message) {
      console.log(message);
    });

  });
