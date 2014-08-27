"use strict";


//Drag Controller
controllers.controller('DragCtrl', function($scope, DragService){

	$scope.xaxis = 0;
	$scope.yaxis = 0;
	$scope.dragging = false;


	$scope.mouseDown = function() {
		DragService.mouseDown();
  	};

  	$scope.mouseUp = function() {
		DragService.mouseUp();
  	};

  	$scope.mouseMove = function($event) {
  		var res=DragService.mouseMove($event);
  		if (res){	//dragging
  			$scope.xaxis=res.x;
  			$scope.yaxis=res.y;
  			$scope.dragging=true;
  		}else{	//not dragging
  			$scope.dragging=false;
  		}
  	};




})

