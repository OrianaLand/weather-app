import { getWeather } from "./api.js";
import { formatWeatherData } from "./dataFormater.js";
import {
  TEMP_UNITS,
  SPEED_UNITS,
  getCurrentTempUnit,
  getCurrentSpeedUnit,
  setCurrentTempUnit,
  setCurrentSpeedUnit,
  convertTemperature,
  convertSpeed,
  formatTemperature,
  formatSpeed,
} from "./unitConverter.js";

//Store formatted data for units conversion
let formattedData = null;
let tempUnitUI = getCurrentTempUnit();

const renderTodayForecast = (data) => {
  //Today's forecast card
  const city = document.querySelector(".location address p");
  const date = document.querySelector(".location time");
  const time = document.querySelector(".time time");
  const temperature = document.querySelector(".current-temp");
  const tempRanges = document.querySelector(".ranges-temp");
  const conditions = document.querySelector(".weather-conditions");

  const currentTempUnit = getCurrentTempUnit();

  const tempUI = convertTemperature(
    data.current.temp,
    data.sourceUnit,
    currentTempUnit
  );

  const tempMinUI = convertTemperature(
    data.current.tempMin,
    data.sourceUnit,
    currentTempUnit
  );
  const tempMaxUI = convertTemperature(
    data.current.tempMax,
    data.sourceUnit,
    currentTempUnit
  );

  city.textContent = data.location;
  date.textContent = data.current.date;
  time.textContent = data.current.time;
  temperature.textContent = formatTemperature(tempUI, currentTempUnit);
  tempRanges.textContent = `${formatTemperature(tempMinUI, currentTempUnit)} 
  / ${formatTemperature(tempMaxUI, currentTempUnit)}`;
  conditions.textContent = data.current.conditions;
};

const renderTodayDetails = (data) => {
  //Temperature
  const currentTempUnit = getCurrentTempUnit();
  const feelsLikeUI = convertTemperature(
    data.current.feelsLike,
    data.sourceUnit,
    currentTempUnit
  );

  //Speed
  const currentSpeedUnit = getCurrentSpeedUnit();
  const speedUI = convertSpeed(
    data.current.windSpeed,
    data.sourceSpeedUnit,
    currentSpeedUnit
  );

  const detailValues = {
    thermalSensation: formatTemperature(feelsLikeUI, currentTempUnit),
    rainProbability: `${data.current.rainProbability}%`,
    windSpeed: formatSpeed(speedUI, currentSpeedUnit),
    humidity: `${data.current.humidity}%`,
    uvIndex: data.current.uvIndex,
  };

  const keysForDetailValues = Object.keys(detailValues);

  const detailsList = document.querySelector(".details-list");

  for (let i = 0; i < detailsList.children.length; i++) {
    const key = keysForDetailValues[i];
    const element = detailsList.querySelector(
      `[data-key="${key}"] .detail-value`
    );
    element.textContent = detailValues[key];
  }
};

const renderPredictions = (data) => {
  const currentTempUnit = getCurrentTempUnit();
  const predictionDays = data.forecast; //Array of 15 days forecast
  const predictionList = document.querySelector(".predictions-list");

  for (let i = 0; i < predictionList.children.length; i++) {
    const day = predictionDays[i];
    const tempMinUI = convertTemperature(
      day.tempMin,
      data.sourceUnit,
      currentTempUnit
    );
    const tempMaxUI = convertTemperature(
      day.tempMax,
      data.sourceUnit,
      currentTempUnit
    );
    //Day
    predictionList.children[i].children[0].textContent = day.date;

    //Conditions
    predictionList.children[i].children[1].children[0].textContent =
      day.conditions;

    //Temperature
    predictionList.children[
      i
    ].children[1].children[1].textContent = `${formatTemperature(
      tempMinUI,
      currentTempUnit
    )} / ${formatTemperature(tempMaxUI, currentTempUnit)}`;
  }
};

const initTempUnitToggle = () => {
  const toggleTempUnitBtn = document.querySelector(".temp-unit-toggle");

  if (!toggleTempUnitBtn) {
    console.warn("Unit toggle button not found");
    return;
  }

  console.log("Initial temp unit:", getCurrentTempUnit());

  toggleTempUnitBtn.addEventListener("click", () => {
    //toggle temperature unit
    const newTempUnit =
      getCurrentTempUnit() === TEMP_UNITS.FAHRENHEIT
        ? TEMP_UNITS.CELSIUS
        : TEMP_UNITS.FAHRENHEIT;
    setCurrentTempUnit(newTempUnit);

    //toggle speed unit
    const newSpeedUnit =
      getCurrentSpeedUnit() === SPEED_UNITS.MILE
        ? SPEED_UNITS.KILOMETER
        : SPEED_UNITS.MILE;
    setCurrentSpeedUnit(newSpeedUnit);

    //Re render with new unit if we have data
    if (formattedData) {
      renderTodayForecast(formattedData);
      renderTodayDetails(formattedData);
      renderPredictions(formattedData);
    }
  });
};

export function initUI() {
  // Initialize the temperature unit toggle
  initTempUnitToggle();

  const searchBtn = document.querySelector(".search-btn");
  const input = document.querySelector(".search-input");

  let data = {};

  const handleSearch = async () => {
    try {
      const city = input.value;
      if (!city.trim()) {
        alert("Please enter a city");
        return;
      }
      data = await getWeather(city);
      formattedData = formatWeatherData(data);

      // Render UI
      renderTodayForecast(formattedData);
      renderTodayDetails(formattedData);
      renderPredictions(formattedData);

      console.log(data);
    } catch (error) {
      console.log(error);
      console.error("Search error:", error);
      alert(`Failed to fetch weather data: ${error.message}`);
    }
  };

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleSearch();
  });

  input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSearch();
    }
  });
}
