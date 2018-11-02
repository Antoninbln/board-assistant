import React, { Component } from 'react';

import Clock from "components/Clock";
import Weather from "components/Weather";
import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

class App extends Component {

  render() {
    console.log(styles, styles.app);
    return (
      <div className={`App ${styles.app}`}>
        <header className="App-header">
          <h1 className="App-title">Interface titre</h1>
          <Clock />
        </header>
      </div>
    );
  }
}

export default App;
