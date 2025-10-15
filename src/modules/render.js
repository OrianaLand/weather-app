import { getWeather } from "./api.js";
import { formatWeatherData } from "./dataFormater.js";

const renderTodayForecast = (data) => {
  //Today's forecast card
  const city = document.querySelector(".location address p");
  const date = document.querySelector(".location time");
  const time = document.querySelector(".time time");
  const temperature = document.querySelector(".current-temp");
  const tempRanges = document.querySelector(".ranges-temp");
  const conditions = document.querySelector(".weather-conditions");

  city.textContent = data.location;
  date.textContent = data.current.date;
  time.textContent = data.current.time;
  temperature.textContent = data.current.temp;
  tempRanges.textContent = `${data.current.tempMin} / ${data.current.tempMax}`;
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
    detailsList.children[i].children[1].textContent =
      detailValues[keysForDetailValues[i]];
  }
};

const renderPredictions = (data) => {
  const predictionsValuesArray = data.forecast;
  console.log(predictionsValuesArray);
  const keysForPredictionValues = Object.keys(predictionsValuesArray[0]);
  console.log(keysForPredictionValues);
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

export function initUI() {
  const button = document.querySelector(".search-btn");
  const input = document.querySelector(".search-input");
  let data = {};

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const city = input.value;
    data = await formatWeatherData(city);
    renderTodayForecast(data);
    renderTodayDetails(data);
    renderPredictions(data);
    console.log(data);
  });
}

//This is for testing only and will be removed later
formatWeatherData("Buenos Aires")
  .then((data) => {
    renderTodayForecast(data);
    renderTodayDetails(data);
    renderPredictions(data);
  })
  .catch((err) => console.error(err));
