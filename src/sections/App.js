import React from "react";

import Clock from "components/Clock";
import Weather from "components/Weather";
import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

const lines = [
  {
    id: 122,
    station: "parc+de+montreau",
    direction: "R"
  }, {
    id: 301,
    station: "parc+de+montreau",
    direction: "A"
  }
];

const App = () => (
  <div className={`app ${styles.app}`}>
    <header className="app-header" />
    <main className="app-main">
      <Vocal />
      <Clock date />
      <Transports lines={lines} />
      <Weather isCurrWeatherShowed isNextWeatherShowed />
    </main>
    
  </div>
);

export default App;
