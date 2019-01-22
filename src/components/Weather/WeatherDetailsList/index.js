import React from "react";

import { getUniqueId } from "utils";
import getTemplate from "./templates";
import styles from "./index.module.scss";

const WeatherDetailsList = ({ weather }) => (
  <div className={`${styles.group} c-weather-details-list`}>
    <div className="weather-details-list__list">
      {Object.entries(weather).map(key => { // Mapping over keys
        const data = getTemplate(key);
        if (!data) return false;

        return data.map(item => (
          // Mapping over values (usually for wind object)
          <div key={getUniqueId()} className="weather-details">
            <img className="weather-details__icon" src={item.icon} alt="Informative icon of the weather" />
            <p className="weather-details__value">{item.value}</p>
          </div>)
        );
      })}
    </div>
  </div>
);

export default WeatherDetailsList;
