'use strict';

/**
 * @ngdoc directive
 * @name pbshowApp.directive:bgImage
 * @description
 * # bgImage
 */
angular.module('twittexpressApp')
  .directive('bgImage', ['$window', function ($window) {
    return {
      //template: '<div></div>',
      //restrict: 'A',
      link: function postLink(scope, element) {

        var resizeBG = function () {
            var bgwidth = element.width();
            var bgheight = element.height();

            var winwidth = $window.innerWidth;
            var winheight = $window.innerHeight;

            var heightdiff, widthdiff, widthratio,
                heightratio;

            if(bgwidth){
              widthratio =  winwidth / bgwidth;
              heightdiff = widthratio * bgheight;
            }else{
              heightdiff = winheight;
            }

            if(bgheight){
              heightratio = winheight / bgheight;
              widthdiff = heightratio * bgwidth;
            }else{
              widthdiff = winwidth;
            }

            if (heightdiff > winheight) {
                element.css({
                    width: winwidth + 'px',
                    height: heightdiff + 'px'
                });
            } else {
                element.css({
                    width: widthdiff + 'px',
                    height: winheight + 'px'
                });
            }
        };

        var windowElement = angular.element($window);
        windowElement.resize(resizeBG);

        element.bind('load', function () {
            resizeBG();
        });
      }
    };
  }]);
