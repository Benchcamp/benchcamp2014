var jsonSongs, jsonAlbums, jsonArtists;

jsonSongs = "../assets/resources/songs.json";
jsonAlbums = "../assets/resources/albums.json";
jsonArtists = "../assets/resources/artists.json";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnFilterSongs").addEventListener("click", displaySongs, false);
    document.getElementById("btnFilterAlbums").addEventListener("click", displayAlbums, false);
    document.getElementById("btnFilterArtists").addEventListener("click", displayArtists, false);
    document.getElementById("btnToggleFilters").addEventListener("click", toggleFilters, false);
    document.getElementById("btnTogglePlaying").addEventListener("click", togglePlaying, false);

    document.getElementById("btnFavSmart").addEventListener("click", addFavorite, false);
    document.getElementById("btnFavTab").addEventListener("click", addFavorite, false);
});

function displaySongs() {
    displayJSONContent(jsonSongs);
}

function displayAlbums() {
    displayJSONContent(jsonAlbums);
}

function displayArtists() {
    displayJSONContent(jsonArtists);
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
    document.getElementById("playing-smart").classList.toggle("panel-hidden");
    document.getElementById("playing-smart").classList.toggle("panel-visible");

    divContent = document.getElementById("content");
    tableContent = document.getElementById("table-content");

    divContent.classList.toggle("full-size");

    if (divContent.classList.contains("full-size") && tableContent.childNodes.length === 0) {
        displaySongs();
    }
}