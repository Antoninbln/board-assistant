import React, { Component } from "react";
import PropTypes from "prop-types";

import getCurrentDate from "utils/dates";
import styles from "./index.module.scss";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { clock: null };
  }
  
  componentDidMount() {
    this.interval = setInterval(
      () => {
        this.setState({ clock: getCurrentDate() });
      }, 1000);
  }

  render() {
    const { clock } = this.state;
    const { date } = this.props;
    const s = <span className="separator"> : </span>;

    return (
      <div className={`c-clock ${styles.clock} sk-skeleton`}>
        {clock && (
          <React.Fragment>
            {date && <span className={`${!clock ? "sk-text-short sk-light" : ""} c-clock__day`}>{clock.day || "&nbps;"}</span>}
            <span className={`${!clock ? "sk-text-short sk-light" : ""} c-clock__time`}>{clock.hours}{s}{clock.minutes}<span className="c-clock__time__seconds">{clock.seconds}</span></span>
          </React.Fragment>
        )}
      </div>
    );
  }
}

Clock.propTypes = {
  date: PropTypes.bool
};

Clock.defaultProps = {
  date: true
};

export default Clock;
