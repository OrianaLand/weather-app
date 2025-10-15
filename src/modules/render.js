import { getWeather } from "./api.js";
import { formatWeatherData } from "./dataFormater.js";

export function initUI() {
  const button = document.querySelector(".search-btn");
  const input = document.querySelector(".search-input");

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const city = input.value;
    const data = await formatWeatherData(city);
    console.log(data);
  });
}
