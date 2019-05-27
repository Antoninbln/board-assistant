import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchBus } from "utils/fetchTransports";
import { getUniqueId } from "utils";

import ServiceItem from "./ServiceItem";
import styles from "./index.module.scss";

class Transports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bus: []
    };
  }

  componentDidMount() {
    const { lines } = this.props;

    fetchBus(lines).then(data => {
      this.setState({
        bus: data
      });
    });

    this.getBus(lines);
  }

  getBus(lines) {
    setInterval(
      () => fetchBus(lines).then(
        data => {
          this.setState({
            bus: data
          });
        }
      ),
      30000
    );
  };

  render() {
    const { bus } = this.state;
    const { style } = this.props;

    if (!bus.length > 0) return <div>Loading</div>;
    return (
      <div className={`c-transports-details ${styles.group}`} style={style}>
        {bus.map(service => <ServiceItem key={getUniqueId()} id={service.id} station={service.station} services={service.schedules} />)}
      </div>
    );
  }
}

Transports.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default Transports;
