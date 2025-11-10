const STORAGE_KEYS = {
  LAST_CITY: "lastSearchedCity",
  TEMP_UNIT: "temperatureUnit",
  SPEED_UNIT: "speedUnit",
};

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
}

function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from local storage:", error);
  }
}

export function saveCity(city) {
  saveToStorage(STORAGE_KEYS.LAST_CITY, city);
}
export function saveTempUnit(tempUnit) {
  saveToStorage(STORAGE_KEYS.TEMP_UNIT, tempUnit);
}
export function saveSpeedUnit(speedUnit) {
  saveToStorage(STORAGE_KEYS.SPEED_UNIT, speedUnit);
}

export function getLastSearchedCity() {
  return getFromStorage(STORAGE_KEYS.LAST_CITY);
}

export function getSavedTempUnit() {
  return getFromStorage(STORAGE_KEYS.TEMP_UNIT);
}

export function getSavedSpeedUnit() {
  return getFromStorage(STORAGE_KEYS.SPEED_UNIT);
}
//Clear all data (this is for testing purposes)
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}
