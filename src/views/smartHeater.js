import React, { Component } from 'react';
import '../App.css';

import Container from '@material-ui/core/Container';


import DynamicLineChart from '../components/dynamicLineChart'
import TemperatureDisplay from '../components/temperature'

import { withAuthorization } from '../components/Session';

class SmartHeaterDisplay extends Component{
    render(){
        return(
            <Container component="main" maxWidth="lg">
            <div>
                <TemperatureDisplay/>
                <DynamicLineChart/>
            </div>
            </Container>
        );
    }
}

const condition = authUser => !!authUser;

// export default SmartHeaterDisplay;
export default withAuthorization(condition)(SmartHeaterDisplay);