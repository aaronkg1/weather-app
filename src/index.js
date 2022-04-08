import _ from "lodash";
import "../src/style/main.css";
import * as util from "./jsmodules/util";
import * as apiFunctions from "./jsmodules/apiFunctions";
import * as domFunction from "./jsmodules/domInteract";

const searchButton = document.querySelector(".search-icon");
const localWeatherBtn = document.querySelector(".location-icon");
const changeUnitsBtn = document.querySelector(".units");
const searchBar = document.querySelector(".search");
const timeframeToggle = document.querySelector(".timeframe-toggle");
const controls = document.querySelector(".hour-controls");
let units = "metric";

async function searchForLocation(units) {
  const locationName = apiFunctions.getFormData();
  const weatherData = await apiFunctions.getDetailedForecast(
    locationName,
    units
  );
  domFunction.displayCurrentData(weatherData, units);
  domFunction.displayMetaData(weatherData, units);
  domFunction.renderForecast(weatherData, units);
  domFunction.backgroundSelect(weatherData);
}

async function showLocalWeather(units) {
  const weatherData = await apiFunctions.getDetailedForecast(false, units);
  domFunction.displayCurrentData(weatherData, units);
  domFunction.displayMetaData(weatherData, units);
  domFunction.renderForecast(weatherData, units);
  domFunction.backgroundSelect(weatherData);
}

async function buildPageFromSavedData() {
  const weatherData = await apiFunctions.getForecastFromSavedData(units);
  domFunction.displayCurrentData(weatherData, units);
  domFunction.displayMetaData(weatherData, units);
  domFunction.renderForecast(weatherData, units);
  domFunction.backgroundSelect(weatherData);
}

searchButton.addEventListener("click", () => {
  searchForLocation(units);
  domFunction.clearSearchBar();
  searchBar.blur();
});

searchBar.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    searchForLocation(units);
    domFunction.clearSearchBar();
    searchBar.blur();
  }
});
timeframeToggle.addEventListener("click", () => {
  if (timeframeToggle.textContent == "Daily") {
    timeframeToggle.textContent = "Hourly";
    controls.classList.remove("hidden");
  } else if (timeframeToggle.textContent == "Hourly") {
    timeframeToggle.textContent = "Daily";
    controls.classList.add("hidden");
  }
});

localWeatherBtn.addEventListener("click", () => {
  showLocalWeather(units);
  domFunction.clearSearchBar();
});

changeUnitsBtn.addEventListener("click", () => {
  if (units == "metric") {
    units = "imperial";
    changeUnitsBtn.textContent = " / °C";
  } else if (units == 'imperial') {
    units = "metric";
    changeUnitsBtn.textContent = " / °F";
  }
  buildPageFromSavedData();
});

if (!localStorage.getItem("lastLocation")) {
  //if last location not stored in localStorage, show the local weather
  showLocalWeather(units);
} else {
  buildPageFromSavedData();
}
