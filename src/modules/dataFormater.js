import { getWeather } from "./api.js";

export async function formatWeatherData(city) {
  try {
    const data = await getWeather(city);
    const formatedData = {
      location: data.location,
      current: {
        date: data.current.date,
        time: data.current.time,
        temp: data.current.temp,
        tempMin: data.current.tempMin,
        tempMax: data.current.tempMax,
        feelsLike: data.current.feelsLike,
        humidity: data.current.humidity,
        conditions: data.current.conditions,
        icon: data.current.icon,
        windSpeed: data.current.windSpeed,
        uvIndex: data.current.uvIndex,
        rainProbability: data.current.rainProbability,
      },
      forecast: data.forecast.map((day) => ({
        date: day.date,
        conditions: day.conditions,
        tempMin: day.tempMin,
        tempMax: day.tempMax,
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
