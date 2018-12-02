import React, { Component } from "react";

import styles from "./index.module.scss";
import getCurrentDate from "../utils/dates";
import "assets/stylessheets/variables.scss";

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
    const { clock } = this.state;

    return (
      <div className={`c-clock ${styles.clock} sk-skeleton`}>
        <span className={`${!clock ? "sk-text-short sk-light" : ""}`}>{clock || "&nbps;"}</span>
      </div>
    );
  }
}

export default Clock;
