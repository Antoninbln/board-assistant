import React from "react";

import { kelvinToCelsius } from "utils/weather.js";
import { getHours } from "utils/dates.js";
import { getTemplate } from "./templates.js";

import styles from "./index.module.scss";

const NextWeathersListItem = ({ data, temperature, icon, hours }) => {
  const template = getTemplate(data);
  if (!template || !data.main || !data.main.temp) return false;

  return (
    <div className={`next-weather ${styles.group}`}>
      {temperature && (
        <p className="next-weather__legend">{kelvinToCelsius(data.main.temp)}<span style={{ position: "absolute" }}>°</span></p>
      )}
      {icon  && (
        <img className="next-weather__icon" src={template.icon[0]} alt={template.description || ""} />
      )}
      {hours && (
        <p className="next-weather__value">{getHours(data.dt)}</p>
      )}
    </div>
  );
};

export default NextWeathersListItem;