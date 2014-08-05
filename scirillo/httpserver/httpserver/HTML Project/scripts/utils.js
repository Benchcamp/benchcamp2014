var artistUrl ="http://localhost:8080/httpserver/httpserver/assets/resources/artists/artist.json";
var  songUrl = "http://localhost:8080/httpserver/httpserver/assets/resources/song/song.json";
var albumUrl = "http://localhost:8080/httpserver/httpserver/assets/resources/albums/albmus.json";

function readFile(type){    	
	var url = "";
	 var array ;
	if(type == "ART"){
		url = artistUrl;
	}else if(type == "ALB"){
		url = albumUrl;
	}else{
		url = songUrl;
	}
	fetchJSONFile(url, function(data){
	    array = data.item.items;
	    var tbl = document.getElementById('content');
	    var jsonHtmlTable = ConvertJsonToTable(array, 'content', null);
	    tbl.innerHTML = jsonHtmlTable;
	});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}
