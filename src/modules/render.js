import { getWeather } from "./api.js";
import { formatWeatherData } from "./dataFormater.js";
import {
  TEMP_UNITS,
  getCurrentTempUnit,
  setCurrentTempUnit,
  convertTemperature,
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

  const currentUnit = getCurrentTempUnit();

  const tempUI = convertTemperature(
    data.current.temp,
    data.sourceUnit,
    currentUnit
  );

  const tempMinUI = convertTemperature(
    data.current.tempMin,
    data.sourceUnit,
    currentUnit
  );
  const tempMaxUI = convertTemperature(
    data.current.tempMax,
    data.sourceUnit,
    currentUnit
  );

  city.textContent = data.location;
  date.textContent = data.current.date;
  time.textContent = data.current.time;
  temperature.textContent = `${tempUI}°${currentUnit}`;
  tempRanges.textContent = `${tempMinUI}°${currentUnit} / ${tempMaxUI}°${currentUnit}`;
  conditions.textContent = data.current.conditions;
};

const renderTodayDetails = (data) => {
  const detailValues = {
    thermalSensation: data.current.feelsLike,
    rainProbability: data.current.rainProbability,
    windSpeed: data.current.windSpeed,
    humidity: data.current.humidity,
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
  const predictionsValuesArray = data.forecast;
  const keysForPredictionValues = Object.keys(predictionsValuesArray[0]);
  const predictionList = document.querySelector(".predictions-list");

  for (let i = 0; i < predictionList.children.length; i++) {
    //Day
    predictionList.children[i].children[0].textContent =
      predictionsValuesArray[i][keysForPredictionValues[0]];

    //Conditions
    predictionList.children[i].children[1].children[0].textContent =
      predictionsValuesArray[i][keysForPredictionValues[1]];

    //Temperature
    predictionList.children[i].children[1].children[1].textContent = `${
      predictionsValuesArray[i][keysForPredictionValues[2]]
    } / ${predictionsValuesArray[i][keysForPredictionValues[3]]}`;
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

    //Re render with new unit if we have data
    if (formattedData) {
      renderTodayForecast(formattedData);
      renderTodayDetails(formattedData);
      renderPredictions(formattedData);

      //Update temperature unit currently displayed
      /* tempUnitUI = getCurrentTempUnit();
      console.log(tempUnitUI); */
    }
    //Update temperature unit currently displayed when there is toggle with no data
    /* tempUnitUI = getCurrentTempUnit();
    console.log(tempUnitUI); */
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

//This is for testing only and will be removed later
/* getWeather("Buenos Aires")
  .then(formatWeatherData)
  .then((data) => {
    renderTodayForecast(data);
    renderTodayDetails(data);
    renderPredictions(data);
  })
  .catch((err) => console.error(err));
 */
