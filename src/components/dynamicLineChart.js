import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import CanvasJSReact from '../assets/canvasjs.react';
import Typography from '@material-ui/core/Typography';

import { withFirebase } from './Firebase';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dps = []

class DynamicLineChartBase extends Component {
	constructor(props) {
		super(props);
		this.updateChart = this.updateChart.bind(this);

		this.props.firebase.fs.collection('temp_sensor_test').orderBy('timestamp','desc').limit(20).get().then(query => {
			query.forEach(doc => {
				let timestamp = doc.data().timestamp
				timestamp = new Date(timestamp * 1000);
				let temperature = doc.data().temp
				let tempdata = {x: timestamp, y: temperature}
				dps.push(tempdata)
			})
		})
	}

	componentDidMount() {
		
		this.props.firebase.fs.collection('temp_sensor_test').orderBy('timestamp','desc').limit(1).onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				// this.setState({current: change.doc.data().temp})
				let timestamp = change.doc.data().timestamp;
				timestamp = new Date(timestamp * 1000);
				let temperature = change.doc.data().temp
				let tempdata = {x: timestamp, y: temperature}
				dps.push(tempdata)
				this.updateChart()
			})
		})
	}
	updateChart() {
		// yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
		// dps.push({x: xVal,y: yVal});
		// xVal++;
		if (dps.length > 20 ) {
			dps.shift();
		}
		this.chart.render();
	}
	render() {
		const options = {
			// title :{
			// 	text: "Temperature Line Chart"
			// },
			
			axisY: { 
				title: "Temperature (°C)", 
			},    
				
			axisX: { 
				title: "Time", 
			},
			
			data: [{
				type: "line",
				dataPoints : dps
			}]
		}
		
		return (
		<div>
			<br></br><br></br>
			<Typography variant="h4" align="center">Temperature Dynamic Line Chart</Typography>
			<br></br>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

const DynamicLineChart = withRouter(withFirebase(DynamicLineChartBase));


export default DynamicLineChart;