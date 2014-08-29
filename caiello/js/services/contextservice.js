'use strict';

/*
Context menu service
*/

//Context menu Service
services.factory("ContextService", function () {

    var _selected;
    // Sets a selected data in a context menu
    var _setSelectedContext = function (selectedata)
    {
      _selected=selectedata;
    };

    //get the data selected in a context menu
    var _getSelectedContext = function ()
    {
      return _selected;
    };

	return {
		setSelectedContext: _setSelectedContext,   // Sets a selected data in a context menu
	 	getSelectedContext : _getSelectedContext //get the data selected in a context menu
	}
});



