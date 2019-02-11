import React from "react";
import PropTypes from "prop-types";

import { getUniqueId } from "utils";

import styles from "./index.module.scss";

const cleanString = str => str.split("+").join(" ");
const getColor = id => {
  if (id === 122)
    return "#C15BC4";
  
  if (id === 301)
    return "#C0CA52";
  
  return "#292929";
};

const ServiceItem = ({ id, station, services }) => {
  const color = getColor(id);

  return (
    <div className={`c-ServiceItem ${styles.group}`}>
      <p className="line-direction">{cleanString(station)} > {services[0].destination}</p>
      <div className="line-services">
        <p className="line-services__id" style={{ backgroundColor: color, boxShadow: `0 1px 7px 1px ${color}` }}>{id}</p>
        <p className="line-services__services">
          {services.map((service, index) => (
            <React.Fragment key={getUniqueId()}>
              {index > 0 && (<span key={getUniqueId()} className="line-services__services__separator">|</span>)}
              <span>{service.message}</span>
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

ServiceItem.propTypes = {
  id: PropTypes.number.isRequired,
  station: PropTypes.string,
  services: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

ServiceItem.defaultProps = {
  station: "PropTypes.string"
};

export default ServiceItem;
