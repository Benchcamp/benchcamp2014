"use strict";

//move all this to a service?
//Drag Controller
controllers.controller('DragCtrl', function($scope, Utilities){

	$scope.xaxis = 0;
	$scope.yaxis = 0;

	$scope.mdown = false;
	$scope.dragging = false;


	$scope.mouseDown = function() {
		console.log("mousedown");
    	$scope.mdown = true;
  	};

  	$scope.mouseMove = function($event) {
		$scope.dragging=true;
    	if ($scope.mdown){
	    	var res = Utilities.getMouseEventResult($event, "Mouse move");
	    	$scope.xaxis=res.x;
	    	$scope.yaxis=res.y;
    	}
  	};

  	$scope.mouseUp = function() {
		console.log("mouseup");
    	$scope.dragging=false;
    	$scope.mdown = false;
  	};

})

