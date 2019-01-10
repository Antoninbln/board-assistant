import { milesToKilometers } from "../../utils/unitConverter.js";
import { windDirection } from "../../utils/weather.js";

/**
 * Return template of weather details (only for visual objects)
 * @param { Object } obj From API weather
 * @return { ArrayOf<Object> } Array of items to display
 */
export const getTemplate = obj => {

  if (obj[1]) { // Yes obj has value
    switch (obj[0]) { // We test keys of obj
      case "main":
        return obj[1].humidity && [{
          icon: "",
          legend: "Humidity",
          value: ""
        }];
  
      case "clouds":
        return obj[1].all && [{
          icon: "",
          legend: "Clouds",
          value: `${obj[1].all}%`
        }];
  
      case "wind":
        const results = [];

        if (obj[1].speed) {
          results.push({
            icon: "",
            legend: "Wind speed",
            value: `${milesToKilometers(obj[1].speed)} km/h`
          });
        }
        if (obj[1].deg) {
          results.push({
            icon: "",
            legend: "Wind °",
            value: windDirection(obj[1].deg)
          });
        }

        return results;
      
      default: 
        return false;
    }
  }
};
