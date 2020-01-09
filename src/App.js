import React from 'react';
import logo from './logo.svg';
import './App.css';

import DynamicLineChart from './components/dynamicLineChart'
import TemperatureDisplay from './components/temperature'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <TemperatureDisplay/>
        <DynamicLineChart/>
      </header>
    </div>
  );
}

export default App;
