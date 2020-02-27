import React, { Component } from 'react';
import '../App.css';

import Container from '@material-ui/core/Container';


import DynamicLineChart from '../components/dynamicLineChart'
import TemperatureDisplay from '../components/temperature'

import { withAuthorization } from '../components/Session';

class SmartHeaterDisplay extends Component{
    render(){
        return(
            <div className="body"> 
            <Container component="main" maxWidth="lg">
            <div>
                <TemperatureDisplay/>
                <DynamicLineChart/>
            </div>
            </Container>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

// export default SmartHeaterDisplay;
export default withAuthorization(condition)(SmartHeaterDisplay);