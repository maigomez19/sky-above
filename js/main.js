const API_KEY_OPENWEATHER = '08666cfe1044302c82893e3c609b2515';
const API_KEY_TOMTOM = 'u7KgMepR9A5GanVwflZrAsFhbCXafcrp';

const btn = document.getElementById('buscar');
const input = document.getElementById('ciudad');
const input2 = document.getElementById('pais');
const divResultado = document.getElementById('resultado');

window.addEventListener('load', ()=>{
    let valorGuardado = '';
    let ultimaBusqueda = localStorage.getItem('Última búsqueda');

    if(ultimaBusqueda != undefined) {
        valorGuardado = ultimaBusqueda;
        buscarClima(valorGuardado);
    }
});

btn.addEventListener('click', ()=>{
    let valorEnviado = input.value;
    let valorEnviado2 = input2.value;

    fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=countries-codes&q=${valorEnviado2}&lang=es`)
    .then(function(response){
            
        return response.json();

    }).then(function(json){

        if(valorEnviado != '' && valorEnviado2 != '') {

            valorEnviado2 = json.records[0].fields.iso2_code;
            console.log('Valor a buscar', valorEnviado + ',' + valorEnviado2);
            buscarClima(valorEnviado + ',' + valorEnviado2);

        } else if(valorEnviado == '' && valorEnviado2 != '') {

            console.log('Valor a buscar', valorEnviado2);
            buscarClima(valorEnviado2);

        } else {

            divResultado.innerHTML = `<div class="mensaje-inicio2 container-fluid text-center p-4">
                                        <h2 class="d-none">Sin resultados</h2>

                                        <img src="imgs/error.gif" alt="icono error" class="mb-2" />

                                        <p>Ciudad no encontrada. Recuerde que el campo "País" no debe estar vacío.</p>
                                     </div>`;
        }
            
    })
    .catch(function(error){

        console.log('Hubo un error', error);
    })
});

function buscarClima(valorABuscar) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valorABuscar}&appid=${API_KEY_OPENWEATHER}&units=metric&lang=es`)
    .then(function(response){
        
        return response.json();

    }).then(function(json){

        mostrarClima(json);

    })
    .catch(function(error){

        console.log('Hubo un error', error);
    })
};

function mostrarClima(data){
    let clima = '';

    if(data.cod === '404') {

        clima += `<section class="mensaje-inicio2 d-flex align-items-center justify-content-center text-center row pt-3 pb-3">
                    <h2 class="d-none">Sin resultados</h2>

                    <img src="imgs/error.gif" alt="icono error" class="p-0 col-12" />
        
                    <p class="col-12 m-0">Ciudad no encontrada. Por favor intente nuevamente.</p>
                 </section>`;

    } else {
        console.log('Datos clima', data);

        localStorage.removeItem('Última búsqueda');
        localStorage.setItem('Última búsqueda', data.name + ',' + data.sys.country);

        clima += `<section class="row align-items-center clima-info p-5">
                    <div class="col-lg-4 col-md-12 div-mapa pr-lg-5 pr-md-0">
                        <img src="" alt="Mapa ${data.name}" class="img-fluid p-0 col-12" id="mapa">
                    </div>

                    <div class="col-12 col-lg-8 p-0 mb-md-4 order-first order-md-first order-lg-last">
                        <div class="row col-12 align-items-center encabezado m-0">
                            <h2 class="col-12 col-md-7 m-0 p-0">${data.name}</h2>

                            <p class="col-12 col-md-5 mt-2 mt-md-0 mb-0 text-md-right" "id="fecha-hora">${fechaActual()}</p>
                        </div>

                        <div class="row align-items-center col-12 temp-actual m-0 p-0 icono-estado">
                            <img src="imgs/iconos-clima/${data.weather[0].icon}.gif" alt="Icono ${data.weather[0].description}" class="col-6 m-0 p-0" id="icono-clima" />
                            <p class="col-6 m-0 p-0">${Math.round(data.main.temp)}°C</p>
                        </div>

                        <ul class="row align-items-center col-12 p-0 m-0">
                            <li class="col-12 col-md-6"><span class="material-icons md-18">person</span>Sensación térmica: ${Math.round(data.main.feels_like)}°C</li>
                            <li class="col-12 col-md-6"><span class="material-icons md-18">water_drop</span>Humedad: ${data.main.humidity}%</li>
                            <li class="col-12 col-md-6"><span class="material-icons md-18">arrow_drop_down</span>Temperatura mínima: ${Math.round(data.main.temp_min)}°C</li>
                            <li class="col-12 col-md-6"><span class="material-icons md-18">arrow_drop_up</span>Temperatura máxima: ${Math.round(data.main.temp_max)}°C</li>
                            <li class="col-12 col-md-6"><span class="material-icons md-18">air</span>Viento: a ${kilometrosPorHora(data.wind.speed)}km/h</li>
                            <li class="col-12 col-md-6"><span class="material-icons md-18">speed</span>Presión atmosférica: ${data.main.pressure}hPa</li>
                        <ul>
                    </div>
                </section>`;

        buscarMapa(data);
    }
    
    divResultado.innerHTML = clima;
   
};

function kilometrosPorHora(velocidad) {
    let velocidaKMH = Math.round(velocidad * 3.6);

    return velocidaKMH;
};

function buscarMapa(data) {
    fetch(`https://api.tomtom.com/map/1/staticimage?layer=basic&style=main&format=png&zoom=5&center=${data.coord.lon},${data.coord.lat}&width=600&height=600&view=Unified&language=es-ES&key=${API_KEY_TOMTOM}`)
    .then(function(response){

        console.log('Datos mapa', response);

        const mapa = document.getElementById('mapa');
        mapa.setAttribute('src', response.url);

    })
    .catch(function(error){
 
        console.log('Hubo un error', error);  
    })
};

function fechaActual() {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() +1;
    let anio = fecha.getFullYear();
    let hora = String(fecha.getHours()).padStart(2, "0");
    let minutos = String(fecha.getMinutes()).padStart(2, "0");

    let fechaEstructura = dia + '/' + mes + '/' + anio + ' - '+ hora + ':' + minutos + 'h.';
    return fechaEstructura;
};