import { milesToKilometers } from "utils/unitConverter";
import { windDirection } from "utils/weather";

import humidityLogo from "./assets/icon-humidity.svg";
import cloudsLogo from "./assets/icon-cloud.svg";
import windOrientationLogo from "./assets/icon-compass.svg";
import windSpeedLogo from "./assets/icon-wind.svg";

/**
 * Return template of weather details (only for visual objects)
 * @param { Object } obj From API weather
 * @return { ArrayOf<Object> } Array of items to display
 */
const getTemplate = obj => {

  if (!obj[1]) // Yes obj has value
    return false;

  switch (obj[0]) { // We test keys of obj
  case "main":
    return obj[1].humidity && [{
      icon: humidityLogo,
      legend: "Humidity",
      value: `${obj[1].humidity}%`
    }];

  case "clouds":
    return obj[1].all && [{
      icon: cloudsLogo,
      legend: "Clouds",
      value: `${obj[1].all}%`
    }];

  case "wind":
    const results = []; // eslint-disable-line no-case-declarations

    if (obj[1].speed) {
      results.push({
        icon: windSpeedLogo,
        legend: "Wind speed",
        value: `${milesToKilometers(obj[1].speed)} km/h`
      });
    }
    if (obj[1].deg) {
      results.push({
        icon: windOrientationLogo,
        legend: "Wind °",
        value: windDirection(obj[1].deg)
      });
    }

    return results;
    
  default: 
    return false;
  }
};

export default getTemplate;
