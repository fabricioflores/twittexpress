'use strict';

angular.module('twittexpressApp')
    .controller('MainCtrl', function ($scope, $timeout, QueueService) {
        var INTERVAL = 10000;

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

        function getTweet(){

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
