import React from "react";

import { getUniqueId } from "utils";
import { getHours } from "utils/dates.js";
import { kelvinToCelsius } from "utils/weather.js";
import { getTemplate } from "./templates.js";
import styles from "./index.module.scss";

const NextWeathersList = ({ reports }) => {
  const reportsToShow = reports.slice(0, 5);

  return (
    <div className={`${styles.group} c-next-weathers-list`}>
      <h3 className="weather-details-list__title">Next reports</h3>
      <div className="next-weathers-list__list">
        {reportsToShow.map(item => { // Mapping over keys
          const data = getTemplate(item);
          console.log("DATA INDEX", data);

          // console.log("TEMPLATE", data, item.main, item.main.temp);
          if (!data || !item.main || !item.main.temp) return false;

          return (
            // Mapping over values (usually for wind object)
            <div key={getUniqueId()} className="next-weather">
              <p className="next-weather__legend">{kelvinToCelsius(item.main.temp)}</p>
              <img className="next-weather__icon" src={data.icon[0]} alt={data.description} />
              <p className="next-weather__value">{getHours(item.dt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NextWeathersList;
