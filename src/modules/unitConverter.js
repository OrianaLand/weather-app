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
