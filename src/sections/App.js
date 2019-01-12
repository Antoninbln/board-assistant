import React, { Component } from 'react';

import Clock from "components/Clock";
import Weather from "components/Weather";
import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

class App extends Component {
  render() {
    return (
      <div className={`app ${styles.app}`}>
        <header className="app-header">
          
          </header>
          <main className="app-main">
            <Vocal />
            <Weather />
          </main>
          <Clock />
      </div>
    );
  }
}

export default App;
