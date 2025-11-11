const parseResponse = (response) => {
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
      tempMin: data.days[0].tempmin,
      tempMax: data.days[0].tempmax,
      currentEpoch: data.currentConditions.datetimeEpoch,
      sunriseEpoch: data.currentConditions.sunriseEpoch,
      sunsetEpoch: data.currentConditions.sunsetEpoch,
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
      conditions: day.conditions,
      tempMin: day.tempmin,
      tempMax: day.tempmax,
      icon: day.icon,
    })),
    description: data.description,
    timezone: data.timezone,
  };
};
export function getWeatherIconURL(iconName) {
  const baseURL =
    "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Color";
  return `${baseURL}/${iconName}.svg`;
}

export async function getWeather(city) {
  try {
    // Use relative path for production, full URL for development
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://weather-app-fle3.onrender.com";

    const response = await fetch(
      `${baseURL}/api/weather?q=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await parseResponse(response);
    const parsedData = parseWeatherData(data);

    return parsedData;
  } catch (error) {
    throw error;
  }
  /*   try {
    const response = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await parseResponse(response);
    const parsedData = parseWeatherData(data);

    return parsedData;
  } catch (error) {
    throw error;
  } */
}
