if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(registration => {
    console.log("Service Worker Registered!");
    console.log(registration);
  }).catch(error => {
    console.log("Service Worker Failed!");
    console.log(console.error);
  });
}





const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItems = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const weatherForecast = document.getElementById('weather-forecast');
const currentTemp = document.getElementById('current-temp');
const searchByLocationWeatherResults = document.getElementById('search-by-location-weather-results')

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sept", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const APi_KEY = '3fe96d8a7d9de6dba1d46cd5e4f910dc'

setInterval( () => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const year = time.getFullYear();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >=13 ? hour %12 : hour 
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';
    //const addZero = hour <10 ? "0" + hour : hour
    //const ZeroMinutes = (minutes < 10) ? "0" + minutes : minutes

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' +hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]+ ' ' + year
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        // object destructuring
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${APi_KEY}`)
        .then(weather => weather.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData (data) {

    let { humidity, pressure, wind_speed, sunrise, sunset} = data.current;

    timezone.innerHTML = data.timezone;
    country.innerHTML = data.lat + 'N' + data.lon+'E' 

    currentWeatherItems.innerHTML =
    `<div class="weather-item">
        <p>Pressure</p>
        <p>${pressure}</p>
    </div>
    <div class="weather-item">
        <p>Humidity</p>
        <p>${humidity}%</p>
    </div>
    <div class="weather-item">
        <p>Wind Speed</p>
        <p>${wind_speed}</p>
    </div>
    <div class="weather-item">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
    </div>
    <div class="weather-item">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
    </div>`;


    let otherDayForecast = '';
    data.daily.forEach((day, index) => {
        if (index == 0) {
            currentTemp.innerHTML = `
            <div class="today" id="current-temp">
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="weather-icon">
            <div class="other">
              <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
              <div class="temp">Night - ${day.temp.night}&#176; C</div>
              <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            
        </div>`

        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
          <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon">
          <div class="temp">Night - ${day.temp.night}&#176; C</div>
          <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>`
        }
    })

    weatherForecast.innerHTML = otherDayForecast;
}


