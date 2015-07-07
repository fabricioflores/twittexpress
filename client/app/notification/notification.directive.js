'use strict';

angular.module('twittexpressApp')
  .directive('notification', function () {
    return {
      templateUrl: 'app/notification/notification.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.$on('new_tweet', function(event, tweet){
          console.log('presentar tweet');
        });
      }
    };
  });
