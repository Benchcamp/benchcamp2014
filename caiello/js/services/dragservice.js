'use strict';

/*
Drag Services
*/


//Drag Service
services.factory("DragService", function (Utilities)  {

  var _mdown = false;

  function _mouseDown(){
    _mdown = true;
  };

  function _mouseMove($event) {

    if (_mdown){
      var res = Utilities.getMouseEventResult($event, "Mouse move");
      return res;
    }else{
      return null;
    }

  }

  function _mouseUp() {
    _mdown = false;
  }

  return {
    mouseDown: _mouseDown, // handle what happens when mouse is down
    mouseMove : _mouseMove, //handle what happens when mouse is moving
    mouseUp : _mouseUp //handle what happens when mouse is up
  }



})




