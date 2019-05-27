import React from "react";
import PropTypes from "prop-types";

import { getUniqueId } from "utils";
import NextWeathersListItem from "./NextWeathersListItem";

import styles from "./index.module.scss";

const NextWeathersList = ({ reports }) => {
  const reportsToShow = reports.slice(0, 5);

  return (
    <div className={`${styles.group} c-next-weathers-list`}>
      <h3 className="next-weathers-list__title">Next reports</h3>
      <div className="next-weathers-list__list">
        {reportsToShow.map(item => ( // Mapping over keys
          <NextWeathersListItem
            key={getUniqueId()}
            data={item}
            temperature
            icon
            hours
          />
        ))}
      </div>
    </div>
  );
};

NextWeathersList.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.shape({}))
};

NextWeathersList.defaultProps = {
  reports: []
};

export default NextWeathersList;
