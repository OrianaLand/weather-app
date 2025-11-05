export const TEMP_UNITS = {
  FAHRENHEIT: "F",
  CELSIUS: "C",
};

export const SPEED_UNITS = {
  MILE: "mph",
  KILOMETER: "Km/h",
};

// Default units from API data
let currentTempUnit = TEMP_UNITS.FAHRENHEIT;
let currentSpeedUnit = SPEED_UNITS.MILE;

//getters
export function getCurrentTempUnit() {
  return currentTempUnit;
}
export function getCurrentSpeedUnit() {
  return currentSpeedUnit;
}

//setters
export function setCurrentTempUnit(newTempUnit) {
  if (
    newTempUnit === TEMP_UNITS.FAHRENHEIT ||
    newTempUnit === TEMP_UNITS.CELSIUS
  ) {
    currentTempUnit = newTempUnit;
  }
}
export function setCurrentSpeedUnit(newSpeedUnit) {
  if (Object.values(SPEED_UNITS).includes(newSpeedUnit)) {
    currentSpeedUnit = newSpeedUnit;
  }
}

//helpers
const fahrenheitToCelsius = (temp) => {
  return Math.round(((temp - 32) * 5) / 9);
};

const celsiusToFahrenheit = (temp) => {
  return Math.round((temp * 9) / 5 + 32);
};

const mileToKilometer = (speed) => {
  return Number((speed * 1.60934).toFixed(1));
};

const kilometerToMile = (speed) => {
  return Number((speed / 1.60934).toFixed(1));
};
//converters
export function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    console.log("Same unit, no conversion needed");
    return Math.round(temp);
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

export function convertSpeed(speed, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    console.log("Same unit, no conversion needed");
    return Number(speed).toFixed(1);
  }

  if (fromUnit === SPEED_UNITS.MILE && toUnit === SPEED_UNITS.KILOMETER) {
    console.log(speed + "convert from F to C");
    return mileToKilometer(speed);
  }

  if (fromUnit === SPEED_UNITS.KILOMETER && toUnit === SPEED_UNITS.MILE) {
    console.log(speed + "convert from C to F");
    return kilometerToMile(speed);
  }
  return Number(speed).toFixed(1);
}

//formatters
export function formatTemperature(temp, unit) {
  return `${temp}°${unit}`;
}

export function formatSpeed(speed, unit) {
  return `${speed} ${unit}`;
}
