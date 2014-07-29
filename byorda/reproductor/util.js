function formatearHora(timestamp) {
	var inDate = new Date(timestamp);
	return dosDigitos(inDate.getHours()) + ":" + dosDigitos(inDate.getMinutes()) + ":" + dosDigitos(inDate.getSeconds());
}

function dosDigitos(numero) {
	return numero > 9 ? numero : "0" + numero;
}