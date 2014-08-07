var jsonCanciones, jsonAlbumes, jsonArtistas;

jsonCanciones = "../assets/resources/canciones.json";
jsonAlbumes = "../assets/resources/albumes.json";
jsonArtistas = "../assets/resources/artistas.json";

document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("btnFilterSongs").addEventListener("click", displaySongs, false);
    document.getElementById("btnFilterAlbums").addEventListener("click", displayAlbums, false);
    document.getElementById("btnFilterArtists").addEventListener("click", displayArtists, false);
    document.getElementById("btnToggleFilters").addEventListener("click", toggleFilters, false);
    document.getElementById("btnTogglePlaying").addEventListener("click", togglePlaying, false);

    document.getElementById("btnFavorite").addEventListener("click", addFavorite, false);
});

function displaySongs() {
    displayJSONContent(jsonCanciones);
}

function displayAlbums() {
    displayJSONContent(jsonAlbumes);
}

function displayArtists() {
    displayJSONContent(jsonArtistas);
}

function addFavorite() {

}

function toggleFilters() {
    document.getElementById("panel-filters").classList.toggle("panel-hidden");
    document.getElementById("panel-filters").classList.toggle("panel-visible");
    document.getElementById("wrapper-top").classList.toggle("full-size");
}

function togglePlaying() {
    var divContent, tableContent;
    document.getElementById("playing").classList.toggle("panel-hidden");
    document.getElementById("playing").classList.toggle("panel-visible");

    divContent = document.getElementById("content");
    tableContent = document.getElementById("table-content");

    divContent.classList.toggle("full-size");

    if (divContent.classList.contains("full-size") && tableContent.childNodes.length === 0) {
        displaySongs();
    }
}