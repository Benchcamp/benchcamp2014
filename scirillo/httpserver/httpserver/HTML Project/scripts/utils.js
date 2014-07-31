
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
		xhr.open("GET","http://localhost:8080/assets/resources/artists/a.txt"); //assuming kgr.bss is plaintext
		xhr.send();

    }
