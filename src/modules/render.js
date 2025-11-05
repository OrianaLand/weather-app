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

//mock data to avoid unnecesary API calls
const mockWeatherData = {
  timezone: "America/Argentina/Buenos_Aires",
  location: "Buenos Aires, Argentina",
  sourceUnit: TEMP_UNITS.FAHRENHEIT, // API normally returns °F
  sourceSpeedUnit: SPEED_UNITS.MILE, // API normally returns mph
  current: {
    date: "2025-10-14",
    time: "15:30",
    temp: 75,
    tempMin: 68,
    tempMax: 79,
    feelsLike: 77,
    humidity: 62,
    conditions: "Partly Cloudy",
    icon: "partly-cloudy-day",
    windSpeed: 9,
    uvIndex: 4,
    rainProbability: 20,
  },
  forecast: [
    {
      date: "2025-10-15",
      conditions: "Mostly Sunny",
      tempMin: 66,
      tempMax: 82,
      icon: "clear-day",
    },
    {
      date: "2025-10-16",
      conditions: "Overcast",
      tempMin: 64,
      tempMax: 75,
      icon: "cloudy",
    },
    {
      date: "2025-10-17",
      conditions: "Rain Showers",
      tempMin: 61,
      tempMax: 72,
      icon: "rain",
    },
    {
      date: "2025-10-18",
      conditions: "Thunderstorms",
      tempMin: 60,
      tempMax: 70,
      icon: "thunder",
    },
    {
      date: "2025-10-19",
      conditions: "Clear Night",
      tempMin: 59,
      tempMax: 73,
      icon: "clear-night",
    },
    {
      date: "2025-10-20",
      conditions: "Partly Cloudy",
      tempMin: 63,
      tempMax: 78,
      icon: "partly-cloudy-day",
    },
    {
      date: "2025-10-21",
      conditions: "Light Rain",
      tempMin: 65,
      tempMax: 74,
      icon: "rain",
    },
  ],
  description:
    "Mild spring week with some humidity and a chance of rain midweek.",
};
//end of mock data

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

    const listItem = predictionList.children[i];
    const dayText = day.date;

    // Day of week - first 3 letters
    listItem.querySelector(".day.start").textContent = dayText.substring(0, 3);

    // Day of week - remaining letters
    listItem.querySelector(".end").textContent = dayText.substring(3);

    /* listItem.querySelector(".day").textContent = day.date; */

    // Weather conditions
    listItem.querySelector(".day-weather").textContent =
      day.conditions.split(",")[0];

    // Min temperature
    listItem.querySelector(".min").textContent = formatTemperature(
      tempMinUI,
      currentTempUnit
    );

    // Max temperature
    listItem.querySelector(".max").textContent = formatTemperature(
      tempMaxUI,
      currentTempUnit
    );
  }
};

const initTempUnitToggle = () => {
  const toggleTempUnitBtn = document.querySelector(".temp-unit-toggle");

  if (!toggleTempUnitBtn) {
    console.warn("Unit toggle button not found");
    return;
  }

  console.log("Initial temp unit:", getCurrentTempUnit());
  toggleTempUnitBtn.textContent = `°${getCurrentTempUnit()}`;
  toggleTempUnitBtn.addEventListener("click", () => {
    //toggle temperature unit
    const newTempUnit =
      getCurrentTempUnit() === TEMP_UNITS.FAHRENHEIT
        ? TEMP_UNITS.CELSIUS
        : TEMP_UNITS.FAHRENHEIT;
    setCurrentTempUnit(newTempUnit);
    toggleTempUnitBtn.textContent = `°${newTempUnit}`;

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

    /* if (mockWeatherData) {
      renderTodayForecast(mockWeatherData);
      renderTodayDetails(mockWeatherData);
      renderPredictions(mockWeatherData);
    } */
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

      // Show loading state
      searchBtn.disabled = true;
      searchBtn.textContent = "Loading...";
      input.disabled = true;

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
    } finally {
      // Reset button state
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
      input.disabled = false;
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

  renderTodayForecast(formattedData);
  renderTodayDetails(formattedData);
  renderPredictions(formattedData);

  /* renderTodayForecast(mockWeatherData);
  renderTodayDetails(mockWeatherData);
  renderPredictions(mockWeatherData); */
}
