"use strict";


//Albums List Controller
controllers.controller('ModalCtrl', function($scope){
	$scope.modalShow = false;
	$scope.showModal = function() {
		console.log("showeando");
    	$scope.modalShow = !$scope.modalShow;
  	};

})

