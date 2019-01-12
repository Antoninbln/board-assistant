import React from "react";

import { windDirection } from "../../utils/weather.js";
import { getUniqueId } from "../../utils";
import { getTemplate } from "./templates.js";
import styles from "./index.module.scss";

const WeatherDetailsList = ({ weather, isNext = false }) => {
  console.log("WEATHER", weather, weather.wind.deg, windDirection(weather.wind.deg));

  //{data.weather_day.weather.map(item => )}

  return (
    <div className={`${styles.group} c-weather-details-list`}>
      {Object.entries(weather).map(key => { // Mapping over keys
        const data = getTemplate(key);
        if (!data) return false;

        console.log("DATA", data);

        return data.map(item => (
          // Mapping over values (usually for wind object)
          <div key={getUniqueId()} className="weather-details">
            <img className="weather-details__icon" src={item.icon} alt="Logo décoratif" />
            <p className="weather-details__legend">{item.legend}</p>
            <p className="weather-details__value">{item.value}</p>
          </div>)
        );
      })}
    </div>
  );
};

export default WeatherDetailsList;
