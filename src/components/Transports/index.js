import React, { Component } from "react";

import { fetchBus } from "../utils/fetchTransports";

class Transports extends Component {
  constructor(props) {
    super(props);
    // this.state = { clock: null };
    this.state = {
      // line = this.props.line
      line: 122,
      bus: null
    }
  }

  async componentDidMount() {
    const first = await fetchBus(122, "parc+de+montreau", "R");
    const second = await fetchBus(301, "parc+de+montreau", "A");

    this.setState({
      bus: {
        principale: first,
        other: second
      }
    });
  }

  render() {
    console.log(this.state.bus.principale);

    if (!this.state.bus) return <div>Load</div>;
    return (
      <div className={`c-transports-details`}>
        <span>Transports</span>
      </div>
    );
  }
}

export default Transports;
