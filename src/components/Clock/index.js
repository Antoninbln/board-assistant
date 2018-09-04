import React, { Component } from "react";

import styles from "./index.module.scss";
import getCurrentDate from "../utils/dates";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { clock: null };
  }
  
  componentDidMount() {
    this.interval = setInterval(
      () => {
        this.setState({ clock: getCurrentDate() })
      }, 1000);
  }

  render() {

    if (!this.state.clock) return <div>Load</div>;

    return (
      <div className={`c-clock ${styles.clock}`}>
        <span>{this.state.clock}</span>
      </div>
    );
  }
}

export default Clock;
