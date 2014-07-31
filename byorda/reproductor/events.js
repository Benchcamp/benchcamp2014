var contadorEventos, controlesAuditables, logEventos, jsonCanciones, jsonAlbumes, jsonArtistas, filtroSeleccionado;

contadorEventos = 0;
controlesAuditables = ["btnFiltroCanciones", "btnFiltroAlbumes", "btnFiltroArtistas", "btnMute", "btnPlayPausa", "btnAtras", "btnSiguiente", "btnRepetir", "btnRandom"];
logEventos = [];

jsonCanciones = "http://localhost:8080/assets/resources/canciones.json";
jsonAlbumes = "http://localhost:8080/assets/resources/albumes.json";
jsonArtistas = "http://localhost:8080/assets/resources/artistas.json";

document.addEventListener("DOMContentLoaded", function(e) {
  for (var i = 0; i < controlesAuditables.length; i++) {
    document.getElementById(controlesAuditables[i]).addEventListener("click", registrarEvento, false);
  };
  
  document.getElementById("btnEventos").addEventListener("click", mostrarLogEventos, false);
  document.getElementById("btnFiltroCanciones").addEventListener("click", mostrarCanciones, false);
  document.getElementById("btnFiltroAlbumes").addEventListener("click", mostrarAlbumes, false);
  document.getElementById("btnFiltroArtistas").addEventListener("click", mostrarArtistas, false);
});

function registrarEvento(e) {
  var evento = {
    accion: e.type,
    elemento: e.target.name,
    hora: new Date().getTime()
  };
  logEventos.push(evento);
  incrementarCantEventos();
}

function incrementarCantEventos() {
  contadorEventos++;
  document.getElementById("lblContadorEventos").innerHTML = contadorEventos;
}

function mostrarLogEventos() {
  var tablaContenido = document.getElementById("tabla-contenido");

  tablaContenido.innerHTML = "";
  tablaContenido.innerHTML += "<tr id=\"cabezal-contenido\"><th>Acci&oacute;n</th><th>Elemento</th><th>Hora</th></tr>";

  for (var i = 0; i < logEventos.length; i++) {
    tablaContenido.innerHTML += "<tr><td>" + logEventos[i].accion + "</td><td>" + logEventos[i].elemento + "</td><td>" + formatearHora(logEventos[i].hora) + "</td></tr>";
  }
}

function mostrarCanciones() {
  mostrarContenidoJSON(jsonCanciones);
}

function mostrarAlbumes() {
  mostrarContenidoJSON(jsonAlbumes);
}

function mostrarArtistas() {
  mostrarContenidoJSON(jsonArtistas);
}