import React, { Component } from "react";

import { fetchBus } from "utils/fetchTransports";

class Transports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      line: this.props.line || 122,
      bus: {
        principale: []
      }
    }
  }

  async componentDidMount() {
    const { line } = this.state;
    // const second = await fetchBus(301, "parc+de+montreau", "A");
    const first = await fetchBus(line, "parc+de+montreau", "R");

    this.setState({
      bus: {
        principale: first,
      }
    });
  }

  render() {
    const { bus } = this.state;

    console.log(bus.principale[0].message);

    if (!bus.length > 0) return <div>Loading</div>;

    return (
      <div className={`c-transports-details`}>
        <span>Transports</span>
      </div>
    );
  }
}

export default Transports;
