// Application entrypoint.

// Load up the application styles
require("../styles/application.scss");

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import Audio from './components/browser_audio/browser_audio.jsx'

ReactDOM.render(<Audio/>, document.getElementById('react-root'));
