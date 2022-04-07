import { assign } from "lodash";
import * as util from './util';

export {getFormData, getCurrentWeather, getDetailedForecast, getForecastFromSavedData}



const getFormData = () => {
    const searchBox = document.querySelector('.search');
    const locationName = searchBox.value;

    if (locationName) {
        return locationName
          .replace(/(\s+$|^\s+)/g, '')
          .replace(/(,\s+)/g, ',')
          .replace(/(\s+,)/g, ',')
          .replace(/\s+/g, '+');
      }
      return '';
    }


const newRequest = (url) => {
    const request = new Request(url, {mode: 'cors'});
    return request;
}

async function getUserLocation() {
        const requestUrl = 'https://ipwhois.app/json/';
        const response = await fetch(newRequest(requestUrl))
        const userJSON = await response.json();
        const location = {};
        location.lat = userJSON.latitude;
        location.lon = userJSON.longitude;
        return location;
}


async function getCurrentWeather(location, coords) { //if coords are omitted, will get weather based on location name
    let requestUrl;
    if (!coords) {
        requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=5cb6f84ef5e0c6b1272b46dc003282f2`;
}
    else {
        requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&APPID=5cb6f84ef5e0c6b1272b46dc003282f2`;
    }
    const response = await fetch(newRequest(requestUrl));
    const weatherData = await response.json();
    const locationInfo = {};
    locationInfo.name = weatherData.name;
    locationInfo.lat = weatherData.coord.lat;
    locationInfo.lon = weatherData.coord.lon;
    return locationInfo; 
}


async function getDetailedForecast(location, units) {
    let requestUrl;
    let locationInfo;
    try {
        if (!location) {  //if location is omitted,  get coordinates of client location and use these to build a forecast
            const userLocation = await getUserLocation();
            locationInfo = await getCurrentWeather('', userLocation);
            }
            else {
            locationInfo = await getCurrentWeather(location, false);
            }
            requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationInfo.lat}&lon=${locationInfo.lon}&units=${units}&appid=5cb6f84ef5e0c6b1272b46dc003282f2`;
            const response = await fetch(newRequest(requestUrl));
            const weatherData = await response.json();
            weatherData.name = locationInfo.name;
            weatherData.isItNight = util.hasSunSet(weatherData); // assign name from first API request as name is not included in response from second request
            localStorage.setItem('lastLocation', JSON.stringify(weatherData));
        
            console.log(weatherData);
            return weatherData;
    }
    catch {
        locationInfo = await getCurrentWeather('London', false);
        requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationInfo.lat}&lon=${locationInfo.lon}&units=${units}&appid=5cb6f84ef5e0c6b1272b46dc003282f2`;
            const response = await fetch(newRequest(requestUrl));
            const weatherData = await response.json();
            weatherData.name = locationInfo.name;
            weatherData.isItNight = util.hasSunSet(weatherData); // assign name from first API request as name is not included in response from second request
            localStorage.setItem('lastLocation', JSON.stringify(weatherData));
        
            console.log(weatherData);
            return weatherData;
        
    }
    

}

async function getForecastFromSavedData(units) {
    const currentLocation = JSON.parse(localStorage.getItem('lastLocation'));
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=${units}&appid=5cb6f84ef5e0c6b1272b46dc003282f2`;
    const response = await fetch(newRequest(requestUrl));

    const weatherData = await response.json();
    weatherData.name = currentLocation.name;
    weatherData.isItNight = util.hasSunSet(weatherData);
    return weatherData;
}




