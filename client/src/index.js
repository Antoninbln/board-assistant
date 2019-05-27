import React from "react";
import ReactDOM from "react-dom";

import registerServiceWorker from "./registerServiceWorker";

import "@babel/polyfill"; // eslint-disable-line import/no-extraneous-dependencies

// import './assets/stylessheets/index.css';
import App from "./sections/App";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

module.hot.accept();
