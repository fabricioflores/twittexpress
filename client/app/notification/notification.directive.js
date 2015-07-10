'use strict';

angular.module('twittexpressApp')
  .directive('notification',['$timeout', 'CONFIG', function ($timeout, CONFIG) {
    return {
      templateUrl: 'app/notification/notification.html',
      restrict: 'EA',
      controller: function ($scope) {
        $scope.$on('new_tweet', function(event, msg){
          $scope.msg = msg;
          $timeout(function (){
            $scope.msg = null;
          },CONFIG.time);
          $scope.$apply();
        });
      }
    };
  }]);
