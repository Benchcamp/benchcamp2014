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
}

function mostrarAlbumes() {
  var tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr><th>Artista</th><th>&Aacute;lbum</th></tr>";

  //Llenar tabla con los albumes
}

function mostrarArtistas() {
  var hrCabezal, tablaContenido;1

  tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr><th>Artista</th></tr>";

  //Llenar con los artistas
}

document.addEventListener("DOMContentLoaded", function(e) {
  document.getElementById("btnFiltroCanciones").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroCanciones").addEventListener("click", mostrarCanciones, false);

  document.getElementById("btnFiltroAlbums").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroAlbums").addEventListener("click", mostrarAlbumes, false);

  document.getElementById("btnFiltroArtistas").addEventListener("click", registrarEvento, false);
  document.getElementById("btnFiltroArtistas").addEventListener("click", mostrarArtistas, false);

  document.getElementById("btnEventos").addEventListener("click", mostrarLogEventos, false);

  if (window.File && window.FileReader && window.FileList && window.Blob) {
   alert('Tu navegador si tiene soporte para estas funciones.');
  } else {
   alert('Tu navegador no tiene soporte para estas funciones.');
  }
});
