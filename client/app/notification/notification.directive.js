'use strict';

angular.module('twittexpressApp')
  .directive('notification', function () {
    return {
      templateUrl: 'app/notification/notification.html',
      restrict: 'EA',
      link: function (scope) {
        scope.$on('new_tweet', function(){
          console.log('presentar tweet');
        });
      }
    };
  });
