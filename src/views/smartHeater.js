import React, { Component } from 'react';
import '../App.css';

import DynamicLineChart from '../components/dynamicLineChart'
import TemperatureDisplay from '../components/temperature'

import { withAuthorization } from '../components/Session';

class SmartHeaterDisplay extends Component{
    render(){
        return(
            <div>
                <TemperatureDisplay/>
                <DynamicLineChart/>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

// export default SmartHeaterDisplay;
export default withAuthorization(condition)(SmartHeaterDisplay);