var artistUrl ="http://localhost:8080/assets/resources/artists/artist.txt";
var  songUrl = "http://localhost:8080/assets/resources/song/song.txt";
var albumUrl = "http://localhost:8080/assets/resources/albums/albmus.txt";

    function readFile(event){
    	var xhr;
		if (window.XMLHttpRequest) {
		    xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	
		xhr.onreadystatechange = function(){			
			document.getElementById("main").innerHTML = xhr.responseText;
		};
		xhr.open("GET","http://localhost:8080/assets/resources/artists/artist.txt"); //assuming kgr.bss is plaintext
		xhr.send();
		//AJAX_JSON_Req("http://localhost:8080/assets/resources/artists/artist.json");
    }

    function readFile(type){
    	var xhr;
		if (window.XMLHttpRequest) {
		    xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	
		xhr.onreadystatechange = function(){			
			document.getElementById("main").innerHTML = xhr.responseText;
		};
		var url = "";
		if(type == "ART"){
			url = artistUrl;
		}else if(type == "ALB"){
			url = albumUrl;
		}else{
			url = songUrl;
		}
		xhr.open("GET",url); //assuming kgr.bss is plaintext
		xhr.send();

    }

    function AJAX_JSON_Req( url ){
	    var AJAX_req = new XMLHttpRequest();
	    AJAX_req.open( "GET", url, true );
	    AJAX_req.setRequestHeader("Content-type", "application/json");
	 
	    AJAX_req.onreadystatechange = function()
	    {
	        if( AJAX_req.readyState == 4 && AJAX_req.status == 200 )
	        {
	            var response = JSON.parse( AJAX_req.responseText );
	            document.write( response.name );
	        }
	    }
	    AJAX_req.send();
	}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



    
