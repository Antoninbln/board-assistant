import React from "react";

import Clock from "components/Clock";
import Weather from "components/Weather";
// import Transports from "components/Transports";
import Vocal from "components/Vocal";

import styles from "./App.module.scss";

const App = () => (
  <div className={`app ${styles.app}`}>
    <header className="app-header" />
    <main className="app-main">
      <Vocal />
      <Weather isCurrWeatherShowed isNextWeatherShowed />
    </main>
    <Clock date />
  </div>
);

export default App;
