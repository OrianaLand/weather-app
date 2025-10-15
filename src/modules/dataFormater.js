import { getWeather } from "./api.js";

export async function formatWeatherData(city) {
  try {
    const data = await getWeather(city);
    const formatedData = {
      location: data.location,
      current: {
        date: data.date,
        time: data.time,
        temp: data.temp,
        feelsLike: data.feelsLike,
        humidity: data.humidity,
        conditions: data.conditions,
        icon: data.icon,
        uvIndex: data.uvIndex,
        rainProbability: data.rainProbability,
      },
      forecast: data.forecast.map((day) => ({
        date: day.date,
        tempMax: day.tempMax,
        tempMin: day.tempMin,
        conditions: day.conditions,
        icon: day.icon,
      })),
      description: data.description,
    };

    return formatedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
