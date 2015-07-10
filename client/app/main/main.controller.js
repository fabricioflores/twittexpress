'use strict';
angular.module('twittexpressApp')
    .controller('MainCtrl', function ($scope, $timeout, QueueService, CONFIG) {
        var INTERVAL = 10000;

        //TODO: pedir el config al server cuando se levanta para poder poner cosas como
        //      el INTERVAL

        function setCurrentSlideIndex(index) {
            $scope.currentIndex = index;
        }

        function isCurrentSlideIndex(index) {
            return $scope.currentIndex === index;
        }

        function nextSlide() {
          $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ?
            ++$scope.currentIndex : 0;
          $timeout(nextSlide, INTERVAL);
        }

        function setCurrentAnimation(animation) {
          $scope.currentAnimation = animation;
        }

        function isCurrentAnimation(animation) {
          return $scope.currentAnimation === animation;
        }

        function loadSlides() {
            QueueService.loadManifest();
        }

        $scope.$on('queueProgress', function (event, queueProgress) {
            $scope.$apply(function () {
                $scope.progress = queueProgress.progress * 100;
            });
        });

        $scope.$on('queueComplete', function (event, slides) {
            $scope.$apply(function () {
                $scope.slides = slides;
                $scope.loaded = true;

                $timeout(nextSlide, INTERVAL);
            });
        });

        $scope.$on('newMessage', function (event, msg) {

            swal({ // jshint ignore:line
                title: msg.user.name + ' <small>@'+ msg.user.screen_name + '</small>',
                text: msg.text,
                imageUrl: msg.user.profile_image_url_https,
                timer: CONFIG.time,
                showConfirmButton: false,
                html: true
          });

        });
        $scope.progress = 0;
        $scope.loaded = false;
        $scope.currentIndex = 0;
        $scope.currentAnimation = 'slide-left-animation';

        $scope.setCurrentSlideIndex = setCurrentSlideIndex;
        $scope.isCurrentSlideIndex = isCurrentSlideIndex;
        $scope.setCurrentAnimation = setCurrentAnimation;
        $scope.isCurrentAnimation = isCurrentAnimation;

        //load the feed services on load
        loadSlides();
});
