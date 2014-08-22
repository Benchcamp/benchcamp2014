'use strict';


var directives=angular.module("player.directives", []);

//hw directive
directives.directive('helloWorld', function() {
  return {
      restrict: 'AEC',
      replace: 'true',
      template: '<h3>Hello World!!</h3>'
  };
});