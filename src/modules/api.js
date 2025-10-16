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

export async function getWeather(city) {
  try {
    const response = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await parseResponse(response);
    console.log(data);
    const parsedData = parseWeatherData(data);
    console.log(parsedData);
    return parsedData;
  } catch (error) {
    throw error;
  }
}
