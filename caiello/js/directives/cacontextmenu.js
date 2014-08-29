'use strict';


//context menu directive
directives.directive('caContextmenu', ['Utilities','ContextService',function() {
  return {
    restrict: 'AE',
    templateUrl: 'views/directives/cacontextmenu.html',
  };
}]);

