var Utility = function(){
    
function _fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = httpRequest.responseText;
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

function _getTimeFromMilisecond(miliseconds){    
    var date = new Date(0, 0, 0, 0, 0, 0, miliseconds);    
    return ("0" + date.getMinutes()).slice (-2) + ":" + ("0" +  date.getSeconds()).slice (-2);
};

function _createTable(data,columns, rowCallbacks){
    var table = document.createElement('table');
        
    var draggable = rowCallbacks != null && rowCallbacks.onDragStart != null;
    
    // add headers
    var tr = document.createElement('tr');
    table.appendChild(tr);
    for (var i = 0; i < columns.length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(columns[i]));
        tr.appendChild(th);        
    }
    
    // add data    
    for (var i = 0; i < data.length; i++) {   
        var row = data[i];
        var tr = document.createElement('tr');
        
        if(rowCallbacks != null){
            tr.onclick = rowCallbacks.onSelectedRow;
            tr.oncontextmenu = rowCallbacks.oncontextmenu;            
        }
        
        tr.data = data[i];
        tr.rowId = i;
                
        if(draggable){
            var draggableAttribute = document.createAttribute("draggable");
            draggableAttribute.value = "true";
            tr.setAttributeNode(draggableAttribute);
            tr.ondragstart = rowCallbacks.onDragStart;
            tr.ondragend = rowCallbacks.onDragEnd;
        }
                
        table.appendChild(tr);
        for (var j = 0; j < columns.length; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data[i][columns[j]]));
            tr.appendChild(td);
        }
    }
    
    return table;
}
 
    function _removeFromArray(array,obj){
        var index = array.indexOf(obj);
        if (index > -1)
            array.splice(index, 1);
    }
    
    function _propertyBehavior(obj, propertyName, arg){    
        if(arg.length != 0){
            obj["__" + propertyName] = arg[0];
            obj.notify(obj, propertyName);
            return obj;
        }else{
            return obj["__" + propertyName];
        }
    }
    
    return {
            fetchJSONFile: _fetchJSONFile,
            getTimeFromMilisecond: _getTimeFromMilisecond,
            createTable: _createTable,
            propertyBehavior:_propertyBehavior,
            removeFromArray: _removeFromArray
           };
    
}();






