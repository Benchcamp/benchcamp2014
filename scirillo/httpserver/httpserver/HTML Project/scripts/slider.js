
function clickSlider(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	bar.addEventListener('mousemove', deslizarSlider, false);	
	slider.style.width = (porcentaje) + '%';	
	instance.setPosition(porcentaje);
	instance.pause();
}

function deslizarSlider(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	slider.style.width = (porcentaje) + '%';
}

function finDeslizar(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	bar.removeEventListener('mousemove', deslizarSlider, false);
	slider.style.width = (porcentaje) + '%';
}