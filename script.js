const main = document.getElementById('main'),
      input = document.getElementById('input'),
      form = document.getElementById('form'),
      articleFirst = document.getElementById('info-weather-article'),
      windSpeed = document.getElementById('wind-speed'),
      visibility = document.getElementById('visibility'),
      sensation = document.getElementById('sensation'),
      humidity = document.getElementById('humidity'),
      uvIndex = document.getElementById('uv'),
      cloud = document.getElementById('cloud'),
      error = document.querySelector('.error')

//API
let div;
let timeZone;

form.addEventListener('submit', (e) => drawWeather(e))

async function drawWeather(e) {
    e.preventDefault()
    const { value } = input
    const respuesta = await fetching(value)
    timeZone = await respuesta.dates.location.tz_id
    actualizaReloj();

}

async function fetching(value){
    const key = "1b6f6ad9a3bf4253a9835115241602"
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${value}&aqi=no`
    const res = await fetch(url)
    const dates = await res.json() 

    if(!res.ok){

        main.style.display = "none"
        error.style.display = "block"

    }else{

        error.style.display = "none"

        const {dayDate, region, country, temperature, condition, icon} = updateVar(dates)
        main.style.display = "block"


        if (!div) {
            div = document.createElement('DIV');
            articleFirst.append(div);
        } else {
            div.innerHTML = '';
        }


        div.innerHTML = `
        <div class="time-zone">
            <div class="zone">
                <p id="day">${dayDate}</p>
                <span id="region">${region}</span>/<span id="country">${country}</span>
            </div>
            <div>
                <p id="time"></p>
            </div>
        </div>
            <p id="temperature">${temperature}°</p>
        <div class="condition">
            <img id="img" src=${icon} alt="">
            <p id="time-zone">${condition}</p>
        </div>
        `;

        windSpeed.innerHTML = dates.current.wind_kph + "Km/h"
        visibility.innerHTML = dates.current.vis_km + "Km/h"
        sensation.innerHTML = dates.current.feelslike_c + "°"
        humidity.innerHTML = dates.current.humidity + "%"
        uvIndex.innerHTML = dates.current.uv
        cloud.innerHTML = dates.current.cloud + "%"

        return { dates }
    }
}

function updateVar (res) {
    dayDate = res.location.localtime.split(" ").splice(0,1,"").join(" ")
    region = res.location.name
    country = res.location.country
    temperature = res.current.temp_c
    condition = res.current.condition.text
    icon = res.current.condition.icon

    return {dayDate , region, country, temperature, condition, icon}
}

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

function actualizaReloj() {
    const time = document.getElementById('time')
    const horaActual = new Date();
  
    // Convertir la hora a la zona horaria especificada
    const horaLocal = horaActual.toLocaleTimeString('en-US', {timeZone: timeZone});
  
    // Extraer horas, minutos y segundos de la hora local
    const [horas, minutos, segundos] = horaLocal.split(':').map(num => parseInt(num));
    
    // Actualizar el contenido del elemento time
    if (main.style.display == "block") {
        time.innerHTML = `${addZero(horas)}:${addZero(minutos)}:${addZero(segundos)}`;
    }

  }
  
  setInterval(actualizaReloj, 1000);

  
