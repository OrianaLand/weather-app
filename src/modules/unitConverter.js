export const TEMP_UNITS = {
  FAHRENHEIT: "F",
  CELSIUS: "C",
};

let currentTempUnit = TEMP_UNITS.FAHRENHEIT; // Default unit from API data

export function getCurrentTempUnit() {
  return currentTempUnit;
}

export function setCurrentTempUnit(newTempUnit) {
  if (
    newTempUnit === TEMP_UNITS.FAHRENHEIT ||
    newTempUnit === TEMP_UNITS.CELSIUS
  ) {
    currentTempUnit = newTempUnit;
  }
}

export const fahrenheitToCelsius = (temp) => {
  return Number((((temp - 32) * 5) / 9).toFixed(1));
};

export const celsiusToFahrenheit = (temp) => {
  return Number(((temp * 9) / 5 + 32).toFixed(1));
};

export function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    console.log("Same unit, no conversion needed");
    return Number(temp).toFixed(1);
  }

  if (fromUnit === TEMP_UNITS.FAHRENHEIT && toUnit === TEMP_UNITS.CELSIUS) {
    console.log(temp + "convert from F to C");
    return fahrenheitToCelsius(temp);
  }

  if (fromUnit === TEMP_UNITS.CELSIUS && toUnit === TEMP_UNITS.FAHRENHEIT) {
    console.log(temp + "convert from C to F");
    return celsiusToFahrenheit(temp);
  }
  return Number(temp).toFixed(1);
}

export const formatTemperature = (temp, unit = currentUnit) => {
  return `${temp}°${unit}`;
};
