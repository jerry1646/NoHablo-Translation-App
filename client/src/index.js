// Application entrypoint.

// // Load up the application styles
// require("../styles/application.scss");

// // Render the top-level React component
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App.jsx';
// import Audio from './components/browser_audio/Audio.jsx'

// ReactDOM.render(<App/>, document.getElementById('react-root'));



// Load up the application styles
require("../styles/application.scss");

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
import TestApp from './TestApp.jsx';
import Audio from './components/browser_audio/Audio.jsx'

ReactDOM.render(<TestApp/>, document.getElementById('react-root'));