function mostrarContenidoJSON(path) {
    var httpRequest = new XMLHttpRequest();
    var retorno;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) { //DONE
            if (httpRequest.status === 200) { //SUCCESS
                mostrarContenido(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function mostrarContenido(jsonDatos) {
  var divContenido, tablaContenido;
  
  tablaContenido = crearTabla(jsonDatos);
  divContenido = document.getElementById("contenido");

  tablaContenido.id = "tabla-contenido";
  divContenido.innerHTML = "";
  divContenido.appendChild(tablaContenido);
}

function crearTabla(jsonDatos) {
    var tabla, tr;
    
    tabla = document.createElement("table");
    tr = document.createElement("tr");

    for (var name in jsonDatos.items[0]) {
        var th = document.createElement("th");
        th.innerHTML = name;
        tr.appendChild(th);
    }

    tabla.appendChild(tr);

    for (var i = 0; i < jsonDatos.items.length; ++i) {
        tr = document.createElement("tr");
        tr.addEventListener("click", seleccionarFila, false);
        tr.id = i + 1;

        for (var name in jsonDatos.items[i]) {
            var td = document.createElement("td");
            td.innerHTML = jsonDatos.items[i][name];
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
    return tabla;
}

// *** SELECCION *** //
function seleccionarFila() {
    deseleccionarTodo();
    this.className = "selected";
}

function seleccionarFilaPorID(id) {
    deseleccionarTodo();
    document.getElementById(id).className = "selected";
}

function deseleccionarTodo() {
    var rows = document.querySelectorAll("#tabla-contenido tr");
    for (var i = 1; i < rows.length; i++) {
        rows[i].className = "";
    }
}

// *** FORMATEOS *** //
function formatearHora(milis) {
    var inDate = new Date(milis);
    return dosDigitos(inDate.getHours()) + ":" + dosDigitos(inDate.getMinutes()) + ":" + dosDigitos(inDate.getSeconds());
}

function dosDigitos(numero) {
    return numero > 9 ? numero : "0" + numero;
}

function msASegundos(milis) {
    return Math.floor(milis / 1000);
}

function msAMinutos(milis) {
    return Math.floor(msASegundos(milis) / 60);
}

function segundosRestantes(milis) {
    return msASegundos(milis) % 60
}

function formatearTiempoReproduccion(milis) {
    return dosDigitos(msAMinutos(milis)) + ":" + dosDigitos(segundosRestantes(milis));
}