'use strict';

//right click context menu directive
directives.directive('caRightclick', ['$parse' , 'Utilities', function($parse) {
    return{

	    link: function(scope, element, attrs) {
	    	
	        var fn = $parse(attrs.caRightclick);
	        element.bind('contextmenu', function(event) {
	            scope.$apply(function() {
	                event.preventDefault();
	                fn(scope, {$event:event});
	            });
	        });
	    }

    };

}]);