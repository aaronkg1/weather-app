import { fromUnixTime, format } from 'date-fns';
import { set } from 'lodash';
import * as util from './util';



function displayCurrentData(data, units) { //display current information
    let speedSuffix;
    let tempUnit;

    if (units === 'metric') {
        speedSuffix = 'km/h';
        tempUnit = '°C';
    }
    else {
        speedSuffix = 'mph';
        tempUnit = '°F';
    }

    const location = document.querySelector('.location');
    const dateTime = document.querySelector('.time');
    const currentTempDisplay = document.querySelector('.temp');
    const weatherIcon = document.querySelector('.weather-icon');
    const currentDateTime = util.formatDate(data.current.dt, data.timezone);
    const currentDay = util.getDayFromDate(fromUnixTime(data.current.dt));
    location.textContent = data.name;
    dateTime.textContent = `${currentDay}, ${currentDateTime}`;
    currentTempDisplay.textContent = `${data.current.temp} ${tempUnit}`;
    weatherIcon.setAttribute('src', displaySymbol(data, false));


}

function displayMetaData(data, units) {
    let speedSuffix;
    let tempUnit;

    if (units === 'metric') {
        speedSuffix = 'km/h';
        tempUnit = '°C';
    }
    else {
        speedSuffix = 'mph';
        tempUnit = '°F';
    }

    const feelsLikeDisplay = document.querySelector('.feels');
    const humidityDisplay = document.querySelector('.humidity');
    const rainChanceDisplay = document.querySelector('.rain-chance');
    const windSpeedDisplay = document.querySelector('.wind-speed');

    feelsLikeDisplay.textContent = `${data.current.feels_like} ${tempUnit}`;
    humidityDisplay.textContent = `${data.current.humidity}` + `%`;
    rainChanceDisplay.textContent = `${data.hourly[0].pop}` + `%`;
    windSpeedDisplay.textContent = `${data.current.wind_speed} ${speedSuffix}`;
}

function displaySymbol(data, forecast) {
    let symbolUrl;
    let mainWeather;
    let weatherDescription;
    if (!forecast) { // if accessing daily data, different paths required
    mainWeather = data.current.weather[0].main;
    weatherDescription =  data.current.weather[0].description;
    }
    else {
    mainWeather = data.weather[0].main;
    weatherDescription = data.weather[0].description;
    }
    if (mainWeather == 'Clouds' || mainWeather == 'Overcast') {
        if (weatherDescription == 'few clouds') {
            symbolUrl = '../src/assets/partly-cloudy.svg';
        }
        else 
       symbolUrl = '../src/assets/overcast.svg';
    }
    else if (mainWeather == 'Rain') {
        if (weatherDescription == 'Light rain') {
            symbolUrl = '../src/assets/light-rain.svg';
        }
        else symbolUrl = '../src/assets/heavy-rain.svg'; 
    }
    else if (mainWeather == 'Snow') {
        if (weatherDescription == 'Heavy Snow') {
            symbolUrl = '../src/assets/snow.svg';
        }
        else symbolUrl = '../src/assets/light-snow.svg';
        
    }
    else if (mainWeather == 'Clear') {
        if (data.isItNight) {
            symbolUrl = '../src/assets/clear-night.svg';
        }
        else
        symbolUrl = '../src/assets/sunny.svg';
    }
    else if (mainWeather == 'thunderstorm') {
        symbolUrl = '../src/assets/lightning.svg';
    }
    return symbolUrl;
}


function backgroundSelect(data) {
    const backgroundContainer = document.querySelector('.background-container');
    const body = document.querySelector('body');
    const mainWeather = data.current.weather[0].main;

    backgroundContainer.classList.remove('background-container');
    backgroundContainer.className = '';
    backgroundContainer.classList.add('background-container');

    if (mainWeather == 'Snow') {
        backgroundContainer.classList.add('snowy');
        
        
    }

    else if (mainWeather == 'Clear') {
        backgroundContainer.classList.add('sunny');

    }
    else if (mainWeather == 'Rain') {
        backgroundContainer.classList.add('rainy');
    }

    else {
        backgroundContainer.classList.add('cloudy')
    }
}

function renderForecast(data, units) {
    let speedSuffix;
    let tempUnit;
    let dayContainers = [];
    const dailyForecastContainer = document.querySelector('.daily-forecast');
    dailyForecastContainer.innerHTML = '';
    const days = data.daily.slice(1); //removes today from the forecast

    if (units === 'metric') {
        speedSuffix = 'km/h';
        tempUnit = '°C';
    }
    else {
        speedSuffix = 'mph';
        tempUnit = '°F';
    }

    days.forEach((day) => {
        const maxTemp = `${day.temp.max} ${tempUnit}`;
        const minTemp = `${day.temp.min} ${tempUnit}`;
        const dayValue = util.getDayFromDate(day.dt, data.timezone);
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('day');
        dayContainer.textContent = dayValue;
        const weatherSymbol = document.createElement('img');
        weatherSymbol.classList.add('daily-icon');
        weatherSymbol.setAttribute('src', displaySymbol(day, true));
        weatherSymbol.setAttribute('alt', day.weather.description);
        dayContainer.appendChild(weatherSymbol);
        const tempDisplay = document.createElement('div');
        tempDisplay.classList.add('temps');
        dayContainer.appendChild(tempDisplay);
        const highTemp = document.createElement('div');
        highTemp.classList.add('high');
        const lowTemp = document.createElement('div');
        lowTemp.classList.add('low');
        highTemp.textContent = maxTemp;
        lowTemp.textContent = minTemp;
        tempDisplay.appendChild(highTemp);
        tempDisplay.appendChild(lowTemp);
        dailyForecastContainer.appendChild(dayContainer);
        dayContainers.push(dayContainer);
          
    })
    util.oneByone(dayContainers, addFadeClass, 300);  
}

function clearSearchBar() {
    const searchBar = document.querySelector('.search');
    searchBar.value = '';
}

function addFadeClass(arrayItem) {
    arrayItem.classList.add('fade-in');
    setTimeout(() => {
        arrayItem.classList.remove('fade-in');
    arrayItem.classList.add('visible');
    }, 400)
    
}


export {displayCurrentData, displayMetaData, clearSearchBar, renderForecast, backgroundSelect}

