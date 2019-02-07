import React, { Component } from "react";
import PropTypes from "prop-types";

import { fetchBus } from "utils/fetchTransports";

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
    const test = [{ id: 122, station: "parc+de+montreau", direction: "R"}];

    fetchBus(test).then(data => {
      this.setState({
        bus: data
      });
    });
  }

  render() {
    const { bus } = this.state;

    console.log("bus principale", bus);

    if (!bus.length > 0) return <div>Loading</div>;

    return (
      <div className="c-transports-details">
        <span>Transports</span>
      </div>
    );
  }
}

Transports.propTypes = {
  //
};

Transports.defaultProps = {
  //
};

export default Transports;
