"use strict";


//Albums List Controller
controllers.controller('ModalCtrl', function($scope){
	$scope.modalShow = false;
	$scope.showModal = function() {
    	$scope.modalShow = !$scope.modalShow;
  	};

})

