var contadorEventos, logEventos;
contadorEventos = 0;
logEventos = [];

function incrementarCantEventos() {
  contadorEventos++;
  document.getElementById("lblContadorEventos").innerHTML = contadorEventos;
}

function registrarEvento(e) {
  var evento = {
    accion: e.type,
    elemento: e.target,
    hora: new Date().getTime()
  };
  logEventos.push(evento);
  incrementarCantEventos();
}

function getJson(path, callback) {
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

//Podrían combinarse en una función única parametrizada, separando el código que llena la tabla en funciones aparte.
function mostrarLogEventos() {
  var tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr id=\"cabezal-contenido\"><th>Acci&oacute;n</th><th>Elemento</th><th>Hora</th></tr>";

  for (var i = 0; i < logEventos.length; i++) {
    tablaContenido.innerHTML += "<tr><td>" + logEventos[i].accion + "</td><td>" + logEventos[i].elemento.id + "</td><td>" + logEventos[i].hora + "</td></tr>";
  }
}

function mostrarCanciones() {
  var tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr><th>Pista</th><th>Artista</th><th>Tiempo</th><th>&Aacute;lbum</th></tr>";

  //Llenar tabla con las canciones
  getJson("http://localhost:8080/assets/resources/canciones.json", function(data){
      for (var i = 0; i < data.canciones.length; i++) {
        var cancion, tablaContenido, row, celdaNombre, celdaAlbum, celdaArtista;

        cancion = data.canciones[i];

        tablaContenido = document.getElementById("tabla-contenido");
        row = document.createElement("tr");
        celdaNombre = document.createElement("td");
        celdaAlbum = document.createElement("td");
        celdaArtista = document.createElement("td");
        
        celdaNombre.innerHTML = cancion.nombre;
        celdaAlbum.innerHTML = cancion.album;
        celdaArtista.innerHTML = cancion.artista;

        row.appendChild(celdaNombre);
        row.appendChild(celdaAlbum);
        row.appendChild(celdaArtista);

        tablaContenido.appendChild(row);
      };
  });
}

function mostrarAlbumes() {
  var tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr><th>Artista</th><th>&Aacute;lbum</th></tr>";

  //Llenar tabla con los albumes
  getJson("http://localhost:8080/assets/resources/albumes.json", function(data){
      for (var i = 0; i < data.albumes.length; i++) {
        var album, tablaContenido, row, celdaNombre, celdaArtista;

        album = data.albumes[i];

        tablaContenido = document.getElementById("tabla-contenido");
        row = document.createElement("tr");
        celdaNombre = document.createElement("td");
        celdaArtista = document.createElement("td");
        
        celdaNombre.innerHTML = album.nombre;
        celdaArtista.innerHTML = album.artista;

        row.appendChild(celdaNombre);
        row.appendChild(celdaArtista);

        tablaContenido.appendChild(row);
      };
  });
}

function mostrarArtistas() {
  var hrCabezal, tablaContenido;1

  tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr><th>Artista</th></tr>";

  //Llenar con los artistas
  getJson("http://localhost:8080/assets/resources/artistas.json", function(data){
      for (var i = 0; i < data.artistas.length; i++) {
        var artista, tablaContenido, row, celdaNombre;

        artista = data.artistas[i];

        tablaContenido = document.getElementById("tabla-contenido");
        row = document.createElement("tr");
        celdaNombre = document.createElement("td");
        
        celdaNombre.innerHTML = artista.nombre;

        row.appendChild(celdaNombre);

        tablaContenido.appendChild(row);
      };
  });
}

document.addEventListener("DOMContentLoaded", function(e) {
  document.getElementById("btnFiltroCanciones").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroCanciones").addEventListener("click", mostrarCanciones, false);

  document.getElementById("btnFiltroAlbumes").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroAlbumes").addEventListener("click", mostrarAlbumes, false);

  document.getElementById("btnFiltroArtistas").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroArtistas").addEventListener("click", mostrarArtistas, false);

  document.getElementById("btnEventos").addEventListener("click", mostrarLogEventos, false);
});