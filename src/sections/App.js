import React, { Component } from 'react';

import Clock from "../components/Clock";
import Weather from '../components/Weather';
import Transports from '../components/Transports';


import "./index.modules.scss";

class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Johnny vous écoute</h1>
        </header>
        <Clock />
        <Transports />
        <Weather lang={"fr"} />
      </div>
    );
  }
}

export default App;
