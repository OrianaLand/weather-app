import { ca } from "date-fns/locale";
import { getWeather, getWeatherIconURL } from "./api.js";
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
import {
  saveCity,
  saveTempUnit,
  saveSpeedUnit,
  getLastSearchedCity,
  getSavedTempUnit,
  getSavedSpeedUnit,
  clearAllData,
} from "./storage.js";
import defaultIcon from "../assets/default-icon.svg";

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
  const icon = document.querySelector(".today-icon");
  const card = document.querySelector(".today-forecast");

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

  city.textContent = data.location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  date.textContent = data.current.date;
  time.textContent = data.current.time;
  temperature.textContent = formatTemperature(tempUI, currentTempUnit);
  tempRanges.textContent = `${formatTemperature(tempMinUI, currentTempUnit)} 
  / ${formatTemperature(tempMaxUI, currentTempUnit)}`;
  conditions.textContent = data.current.conditions;

  if (data && data.current && data.current.icon) {
    icon.src = getWeatherIconURL(data.current.icon);
  } else {
    icon.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzMzMiLz4KPC9zdmc+";
  }

  if (data.isDay) {
    card.classList.remove("is-night");
    card.classList.add("is-day");
  } else {
    card.classList.add("is-night");
    card.classList.remove("is-day");
  }
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
    const startElement = listItem.querySelector(".day.start");
    const endElement = startElement.querySelector(".end"); // Select .end from within .start

    // Day of week - replace first child node, which is a text node, with first 3 letters
    startElement.childNodes[0].textContent = dayText.substring(0, 3);

    // Remaining letters in the nested .end span
    endElement.textContent = dayText.substring(3);

    //Icon
    if (day && day.icon) {
      listItem.querySelector(".weekly-icon").src = getWeatherIconURL(day.icon);
    } else {
      // Temporary test - use a simple SVG data URL
      listItem.querySelector(".weekly-icon").src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzMzMiLz4KPC9zdmc+";
    }

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

  //Check for saved data on local Storage
  const savedTempUnitLS = getSavedTempUnit();
  const savedSpeedUnitLS = getSavedSpeedUnit();

  if (savedTempUnitLS) {
    setCurrentTempUnit(savedTempUnitLS);
  }

  if (savedSpeedUnitLS) {
    setCurrentSpeedUnit(savedSpeedUnitLS);
  }

  console.log("Initial temp unit:", getCurrentTempUnit());
  toggleTempUnitBtn.textContent = `°${getCurrentTempUnit()}`;

  toggleTempUnitBtn.addEventListener("click", () => {
    //toggle temperatur and save in local storagee unit
    const newTempUnit =
      getCurrentTempUnit() === TEMP_UNITS.FAHRENHEIT
        ? TEMP_UNITS.CELSIUS
        : TEMP_UNITS.FAHRENHEIT;
    setCurrentTempUnit(newTempUnit);
    saveTempUnit(newTempUnit);
    toggleTempUnitBtn.textContent = `°${newTempUnit}`;

    //toggle speed unit and save in local storage
    const newSpeedUnit =
      getCurrentSpeedUnit() === SPEED_UNITS.MILE
        ? SPEED_UNITS.KILOMETER
        : SPEED_UNITS.MILE;
    setCurrentSpeedUnit(newSpeedUnit);
    saveSpeedUnit(newSpeedUnit);

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

//helper functions for content visibility management
const showContent = () => {
  const intro = document.querySelector(".intro");
  const content = document.querySelector(".content");

  if (intro && content) {
    intro.classList.add("hidden");
    content.classList.add("visible");
  }
};

const hideContent = () => {
  const intro = document.querySelector(".intro");
  const content = document.querySelector(".content");

  if (intro && content) {
    /* intro.classList.remove("hidden"); */
    content.classList.remove("visible");

    setTimeout(() => {
      intro.classList.remove("hidden");
    }, 300); // Match the CSS transition time
  }
};

export function initUI() {
  // Initialize the temperature unit toggle
  initTempUnitToggle();

  const searchBtn = document.querySelector(".search-btn");
  const input = document.querySelector(".search-input");
  const logo = document.querySelector(".icon-title");

  let data = {};

  //Check for data on local storage
  const savedCityLS = getLastSearchedCity();
  console.log(savedCityLS); //this is logging the temp C/F so ERROR
  if (savedCityLS) {
    //Auto-load the saved city
    input.value = savedCityLS;
    setTimeout(() => {
      handleSearch();
      input.value = "";
    }, 10);
  }

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

      // Show content and hide intro
      showContent();

      //Save to local Storage
      saveCity(city);

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
    input.value = "";
  });

  input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSearch();
      input.value = "";
    }
  });

  logo.addEventListener("click", () => {
    hideContent();
    clearAllData();
    input.value = "";
    /* window.location.reload(); */
  });

  /* renderTodayForecast(formattedData);
  renderTodayDetails(formattedData);
  renderPredictions(formattedData); */

  /* renderTodayForecast(mockWeatherData);
  renderTodayDetails(mockWeatherData);
  renderPredictions(mockWeatherData); */
}
