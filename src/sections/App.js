import React, { Component } from 'react';

import Clock from "components/Clock";
import Weather from "components/Weather";
import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

class App extends Component {
  render() {
    return (
      <div className={`App ${styles.app}`}>
        <header className="App-header">
          <Clock />
          <Vocal />
        </header>
      </div>
    );
  }
}

export default App;
