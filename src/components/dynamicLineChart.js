import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';

import { db } from './firebase';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// var dps = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];   //dataPoints.
var dps = []
// var xVal = dps.length + 1;
// var yVal = 15;
// var updateInterval = 1000;

db.collection('temp_sensor_test').orderBy('timestamp','desc').limit(20).get().then(query => {
	query.forEach(doc => {
		let timestamp = doc.data().timestamp
		timestamp = new Date(timestamp * 1000);
		// timestamp = timestamp.toUTCString(); 
		// timestamp = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)		
		// console.log(timestamp)
		// console.log(typeof timestamp)
		let temperature = doc.data().temp
		let tempdata = {x: timestamp, y: temperature}
		dps.push(tempdata)
	})
})

class DynamicLineChart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
	}

	componentDidMount() {
		db.collection('temp_sensor_test').orderBy('timestamp','desc').limit(1).onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
                // this.setState({current: change.doc.data().temp})
                let timestamp = change.doc.data().timestamp;
				// let datetime = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp);
				timestamp = new Date(timestamp * 1000);
                let temperature = change.doc.data().temp
				let tempdata = {x: timestamp, y: temperature}
				dps.push(tempdata)
				this.updateChart()
			})
		})

		// setInterval(this.updateChart, updateInterval);
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
			title :{
				text: "Temperature Line Chart"
			},
			
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
			<h1>Temperature Dynamic Line Chart</h1>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default DynamicLineChart;