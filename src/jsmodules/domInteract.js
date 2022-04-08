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
    const weatherDisplay = document.querySelector('.weather-info');
    const location = document.querySelector('.location');
    const dateTime = document.querySelector('.time');
    const currentTempDisplay = document.querySelector('.temp');
    const weatherIcon = document.querySelector('.weather-icon');
    const thermometerIcon = document.querySelector('.thermometer');
    thermometerIcon.className = 'thermometer';
    thermometerIcon.classList.add(displayThemometer(data.current.temp, units));
    const currentDateTime = util.formatDate(data.current.dt, data.timezone);
    const currentDay = util.getDayFromDate(fromUnixTime(data.current.dt));
    location.textContent = data.name;
    dateTime.textContent = `${currentDay}, ${currentDateTime}`;
    currentTempDisplay.textContent = `${data.current.temp} ${tempUnit}`;
    weatherIcon.className = 'icon weather weather-icon';
    weatherIcon.classList.add(displaySymbol(data, false));

    addFadeClass(weatherDisplay);

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

function displayThemometer(temperature, units) {
    const freezing = 'freezing-temp';
    const normal = 'normal-temp';
    const warm = 'warm-temp'
if (units == 'metric') {
    if (temperature <= 0) {
        return freezing;
    }
    else if (temperature <= 15) {
        return normal;
    }
    else return warm;
}
else {
    if (temperature <= 32) {
        return freezing;
    }
    else if (temperature <= 59) {
        return normal
    }
    else return warm;
}
}

function displaySymbol(data, forecast) {
    let imageClass;
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
            imageClass = 'prt-cloud-icon';
        }
        else 
       imageClass = 'overcast-icon';
    }
    else if (mainWeather == 'Rain') {
        if (weatherDescription == 'Light rain') {
            imageClass = 'light-rain-icon';
        }
        else imageClass = 'light-rain-icon'; 
    }
    else if (mainWeather == 'Snow') {
        if (weatherDescription == 'Heavy Snow') {
            imageClass = 'snow-icon';
        }
        else imageClass = 'light-snow-icon';
        
    }
    else if (mainWeather == 'Clear') {
        if (data.isItNight) {
            imageClass = 'cl-night-icon';
        }
        else
            imageClass = 'sunny-icon';
    }
    else if (mainWeather == 'Thunderstorm') {
        imageClass = 'lightning-icon';
    }
    else if (mainWeather == 'Mist') {
        imageClass = 'misty-icon'
    }
    return imageClass;
}


function backgroundSelect(data) {
    const backgroundContainer = document.querySelector('.background-container');
    const mainWeather = data.current.weather[0].main;

    backgroundContainer.classList.remove('background-container');
    backgroundContainer.className = '';
    backgroundContainer.classList.add('background-container');

    if (mainWeather == 'Snow') {
        backgroundContainer.classList.add('snowy');  
    }
    else if (mainWeather == 'Clear') {
        if (data.isItNight) {
            backgroundContainer.classList.add('night');
        }
        else  backgroundContainer.classList.add('sunny');
    }
    else if (mainWeather == 'Rain') {
        backgroundContainer.classList.add('rainy');
    }

    else backgroundContainer.classList.add('cloudy');
}

function renderForecast(data, units) {
    const timeframeToggle = document.querySelector('.timeframe-toggle');
    if (timeframeToggle.textContent == '') {
        timeframeToggle.textContent = 'Daily'
    }
    timeframeToggle.addEventListener('click', () => { 
    renderForecast(data, units);
    });

    let speedSuffix;
    let tempUnit;
    let dayContainers = [];
    const forecastContainer = document.querySelector('.daily-forecast');
    forecastContainer.className = 'daily-forecast';
    forecastContainer.innerHTML = '';

    if (timeframeToggle.textContent == 'Daily') {
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
        const weatherSymbol = document.createElement('div');
        weatherSymbol.classList.add('daily-icon');
        weatherSymbol.classList.add(displaySymbol(day, true));
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
        forecastContainer.appendChild(dayContainer);
        dayContainers.push(dayContainer);
          
    })
    util.oneByone(dayContainers, addFadeClass, 150);  
}
 else {
    let hourContainers = [];
    let hours;
    forecastContainer.classList.add('hourly');
    const dots = [...document.querySelectorAll('.dot')];
    const activeDot = document.querySelector('.active');
    const dotIndex = dots.indexOf(activeDot);
    let hours1 = data.hourly.slice(1, 9);
    let hours2 = data.hourly.slice(9, 17);
    let hours3 = data.hourly.slice(17, 25);

    (dotIndex == 2) ? hours = hours3 : (dotIndex == 1) ? hours = hours2 : hours = hours1;
    
    
    if (units === 'metric') {
        tempUnit = '°C';
    }
    else {
        tempUnit = '°F';
    }
    hours.forEach((hour) => {
        const temp = `${hour.temp} ${tempUnit}`;
        const hourValue = util.getHourFromUnix(hour.dt, data.timezone);
        const hourContainer = document.createElement('div');
        hourContainer.classList.add('hour');
        hourContainer.textContent = `${hourValue}:00`;
        const weatherSymbol = document.createElement('div');
        weatherSymbol.classList.add('daily-icon');
        weatherSymbol.classList.add(displaySymbol(hour, true));
        hourContainer.appendChild(weatherSymbol);
        const tempDisplay = document.createElement('div');
        tempDisplay.classList.add('temps');
        hourContainer.appendChild(tempDisplay);
        tempDisplay.textContent = temp;
        forecastContainer.appendChild(hourContainer);
        hourContainers.push(hourContainer);
    })
    
    const dotsNodeList = document.querySelectorAll('.dot'); //add listener to flick between hours
    dotsNodeList.forEach(dot => {
        dot.addEventListener('click', () => {
            dotsNodeList.forEach(item => item.className = 'dot');
            dot.classList.add('active');
            renderForecast(data, units);
        })
    })
    util.oneByone(hourContainers, addFadeClass, 150); 
}
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

