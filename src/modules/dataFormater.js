import { TEMP_UNITS, SPEED_UNITS } from "./unitConverter.js";
import { formatInTimeZone } from "date-fns-tz";

const formatDate = (date, tz) => {
  try {
    // Format directly in the target timezone without intermediate conversion
    return formatInTimeZone(date, tz, "EEEE, MMMM do");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const formatTime = (tz) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  const now = new Date().toLocaleString("en-US", { ...options, timeZone: tz });
  return now;
};

const formatDayOnly = (date, tz) => {
  return formatInTimeZone(date, tz, "EEE");
};

export function formatWeatherData(data) {
  const timeZone = data.timezone;

  const formatedData = {
    location: data.location,
    sourceUnit: TEMP_UNITS.FAHRENHEIT, //API returns temperature in Fahrenheit
    sourceSpeedUnit: SPEED_UNITS.MILE, //API returns speed in mph
    current: {
      date: formatDate(data.current.date, timeZone),
      time: formatTime(timeZone),
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
      date: formatDayOnly(day.date, timeZone),
      conditions: day.conditions,
      tempMin: day.tempMin,
      tempMax: day.tempMax,
      icon: day.icon,
    })),
    description: data.description,
  };

  return formatedData;
}
