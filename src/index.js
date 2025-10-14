import "./styles.css";

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
      date: data.days[0].datetime,
      time: data.currentConditions.datetime,
      temp: data.currentConditions.temp,
      feelsLike: data.currentConditions.feelslike,
      humidity: data.currentConditions.humidity,
      conditions: data.currentConditions.conditions,
      icon: data.currentConditions.icon,
      windSpeed: data.currentConditions.windspeed,
      uvIndex: data.currentConditions.uvindex,
      rainProbability: data.currentConditions.precipprob,
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

const button = document.querySelector(".search-btn");
const input = document.querySelector(".search-input");

button.addEventListener("click", (e) => {
  e.preventDefault;
  const city = input.value;
  console.log(city);
  getWeather(city);
});

getWeather("Caracas");
