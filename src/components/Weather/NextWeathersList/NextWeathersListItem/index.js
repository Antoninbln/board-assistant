import React from "react";
import PropTypes from "prop-types";

import { kelvinToCelsius } from "utils/weather";
import { getHours } from "utils/dates";
import { getTemplate } from "./templates";

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

NextWeathersListItem.propTypes = {
  data: PropTypes.shape({}),
  temperature: PropTypes.bool,
  icon: PropTypes.bool,
  hours: PropTypes.bool
};

NextWeathersListItem.defaultProps = {
  data: {},
  temperature: false,
  icon: false,
  hours: false
};

export default NextWeathersListItem;