import React, { Component } from "react";
import { Transition } from "react-transition-group";

import Clock from "components/Clock";
import Weather from "components/Weather";
import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: [
        {
          id: 122,
          station: "parc+de+montreau",
          direction: "R"
        }, {
          id: 301,
          station: "parc+de+montreau",
          direction: "A"
        }
      ],
      isMeteoOpened: false,
      isBusOpened: false
    };

    this.openMeteo = this.openMeteo.bind(this);
    this.openBus = this.openBus.bind(this);
  }

  openMeteo(opening) {
    this.setState({
      isMeteoOpened: opening
    });
  }

  openBus(opening) {
    this.setState({
      isBusOpened: opening
    });
  }

  render() {
    const { isMeteoOpened, isBusOpened, lines } = this.state;
    const duration = 400;

    const defaultStyleTransport = {
      transition: `left ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
      opacity: 0,
      left: -360
    };

    const defaultStyleWeather = {
      transition: `right ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
      opacity: 0,
      right: -360
    };

    const transitionStylesTransport = {
      entering: { left: -360, opacity: 0 },
      entered:  { left: 100, opacity: 1 },
    };

    const transitionStylesWeather = {
      entering: { right: -360, opacity: 0 },
      entered:  { right: 100, opacity: 1 },
    };

    return (
      <div className={`app ${styles.app}`}>
        <header className="app-header" />
        <main className="app-main">
          <Vocal
            openMeteo={this.openMeteo}
            openBus={this.openBus}
          />
          <Clock date />
          <Transition
            in={isBusOpened}
            timeout={duration}
            unmountOnExit
          >
            {state => (
              <Transports
                lines={lines}
                transitionState={state}
                style={{ ...defaultStyleTransport, ...transitionStylesTransport[state] }}
              />
            )}
          </Transition>
          <Transition
            in={isMeteoOpened}
            timeout={duration}
            unmountOnExit
          >
            {state => (
              <Weather
                isCurrWeatherShowed
                isNextWeatherShowed
                style={{ ...defaultStyleWeather, ...transitionStylesWeather[state] }}
              />
            )}
          </Transition>
        </main>
      </div>
    );
  };
};

export default App;
