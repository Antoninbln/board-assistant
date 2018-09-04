import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';

import './assets/stylessheets/index.css';
import App from './sections/App.js';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
