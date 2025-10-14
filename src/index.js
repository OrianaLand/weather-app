import "./styles.css";

const WEATHER_API_KEY = "S9KDA5JKXRYPPGPT549CSGK28";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

const parseResponse = (response) => {
  console.log("unparsed response:");
  console.log(response);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return response.json();
};

const parseWeatherData = (data) => {
  return {
    location: data.resolvedAddress,
    current: {
      temp: data.currentConditions.temp,
      feelsLike: data.currentConditions.feelslike,
      humidity: data.currentConditions.humidity,
      conditions: data.currentConditions.conditions,
      icon: data.currentConditions.icon,
    },
    forecast: data.days.map((day) => ({
      date: day.datetime,
      tempMax: day.tempmax,
      temMin: day.tempmin,
      conditions: day.conditions,
      icon: day.icon,
    })),
    description: data.description,
  };
};

async function getWeather(city) {
  try {
    const response = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await parseResponse(response);
    console.log("parsed data:");
    console.log(data);

    const parsedData = parseWeatherData(data);
    console.log("data to display to user;");
    console.log(parsedData);
  } catch (error) {
    console.log(error);
  }
}

getWeather("Caracas");
