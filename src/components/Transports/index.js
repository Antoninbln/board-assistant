import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchBus } from "utils/fetchTransports";

import ServiceItem from "./ServiceItem";
import styles from "./index.module.scss";

class Transports extends Component {
  constructor(props) {
    super(props);
    // const { lines } = this.props;

    this.state = {
      bus: []
    };
  }

  componentDidMount() {
    const { bus } = this.state;
    const { lines } = this.props;

    fetchBus(lines).then(data => {
      this.setState({
        bus: data
      });
    });
  }

  render() {
    const { bus } = this.state;

    if (!bus.length > 0) return <div>Loading</div>;
    return (
      <div className={`c-transports-details ${styles.group}`}>
        {bus.map(service => <ServiceItem id={service.id} station={service.station} services={service.schedules} />)}
      </div>
    );
  }
}

Transports.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default Transports;
