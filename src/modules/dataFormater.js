const formatDate = (date, tz) => {
  const options = { weekday: "long", month: "short", day: "numeric" };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    ...options,
    timeZone: tz,
  });
};

const formatTime = (tz) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  const now = new Date().toLocaleString("en-US", { ...options, timeZone: tz });
  return now;
};

export function formatWeatherData(data) {
  const timeZone = data.timezone;

  const formatedData = {
    location: data.location,
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
      date: formatDate(day.date, timeZone),
      conditions: day.conditions,
      tempMin: day.tempMin,
      tempMax: day.tempMax,
      icon: day.icon,
    })),
    description: data.description,
  };

  return formatedData;
}
