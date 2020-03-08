import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../App.css";
import { withFirebase } from "../Firebase";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from 'react-router-dom';
import * as ROUTES from "../../constants/routes";

import CanvasJSReact from "../../assets/canvasjs.react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dps = [];

const useStyles = makeStyles(theme => ({
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200
	},
	root: {
		flexGrow: 1,
		align: "center"
	},
	paper: {
		padding: theme.spacing(2),
		margin: "auto",
		maxWidth: 200
	}
}));

const INITIAL_STATE = {
	minTemp: 0,
	minTempDocID: "",
	current: 0,
	newMinTemp: ""
};

class IoTHeaterBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			heaterID: props.location.state.heaterID,
			orderID: props.location.state.orderID,
			dish: props.location.state.dish,
			menu: props.location.state.menu
		};
		this.classes = { useStyles };

		this.props.firebase.fs
			.collection("IoTSensorLogs")
			.orderBy("timestamp", "desc")
			.limit(20)
			.get()
			.then(query => {
				query.forEach(doc => {
					if (doc.data().ID === String(this.state.heaterID)) {
						let timestamp = doc.data().timestamp;
						timestamp = new Date(timestamp * 1000);
						let temperature = doc.data().temp;
						let tempdata = { x: timestamp, y: temperature };
						dps.push(tempdata);
					}
				});
			});
	}

	componentDidMount() {
		// console.log(this.props.location)
		this.props.firebase.fs
			.collection("device_settings")
			.where("ID", "==", String(this.state.heaterID))
			.onSnapshot(snapshot => {
				//to me, this is the 60 threshold.
				let changes = snapshot.docChanges(); //if a new value is keyed in, update the value
				changes.forEach(change => {
					// both in the constant and in db.
					if (change.doc.data().name === "temperature sensor") {
						// this.state.minTemp = change.doc.data().minimum
						this.setState({
							minTemp: change.doc.data().minimum, //pulls from MINIMUM
							minTempDocID: change.doc.id //the device settings doc id will change, so must update here for reference.
						});
					}
				});
			});

		this.props.firebase.fs
			.collection("IoTSensorLogs")
			.orderBy("timestamp", "desc")
			.limit(1)
			.onSnapshot(snapshot => {
				let changes = snapshot.docChanges();
				changes.forEach(change => {
					if (change.doc.data().ID === String(this.state.heaterID)) {
						this.setState({ current: change.doc.data().temp }); //this is what the temp is. if i replace temp with timestamp then it changes
						let timestamp = change.doc.data().timestamp;
						timestamp = new Date(timestamp * 1000);
						let temperature = change.doc.data().temp;
						let tempdata = { x: timestamp, y: temperature };
						dps.push(tempdata);
						this.updateChart();
					}
				});
			});
	}

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({
			open: false
		});
	};

	updateChart() {
		if (dps.length > 20) {
			dps.shift();
		}
		this.chart.render();
	}

	onSubmit = event => {
		event.preventDefault();
		let num = Number(this.state.newMinTemp); //sets the var
		// let num = this.newMinTemp;
		console.log(num);
		console.log(typeof num);
		this.props.firebase.fs
			.collection("device_settings")
			.doc(this.state.minTempDocID)
			.update({
				minimum: num
			}); //UPDATE FIRESTORE

		this.handleClickOpen();
		this.setState({ newMinTemp: "" });
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		const { newMinTemp } = this.state;

		const options = {
			axisY: {
				title: "Temperature (°C)"
			},

			axisX: {
				title: "Time"
			},

			data: [
				{
					type: "line",
					dataPoints: dps
				}
			]
		};

		return (
			
			<div align="center" className={this.classes.root}>
				{/* <Paper className={this.classes.paper}>        */}
				<Typography variant="h4">Order: #{this.state.orderID}</Typography>
				<Typography variant="h4">Dish: {this.state.dish}</Typography>
				<Typography variant="h4">Heater: #{this.state.heaterID}</Typography>
				<p>Temperature Threshold: {this.state.minTemp}</p>
				<p>Current Temperature: {this.state.current}</p>
				<div style={{ alignSelf: "center" }}>
					<TextField
						name="newMinTemp"
						value={newMinTemp}
						onChange={this.onChange}
						label="Set Threshold"
						defaultValue="65"
						type="Number"
						variant="outlined"
						margin="dense"
						align="left"
					/>
				</div>

				<form onSubmit={this.onSubmit}>
					<Button
						style={{ alignSelf: "center" }}
						// disabled={isInvalid}
						type="submit"
						variant="contained"
						color="primary"
						className={this.classes.submit}
						margin="normal"
					>
						Submit
					</Button>

					<Dialog
						open={this.state.open}
						onClose={this.handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{"Submission Notification"}
						</DialogTitle>
						<DialogContent dividers>
							<DialogContentText id="alert-dialog-description">
								Temperature has been changed to{" "}
								{this.state.minTemp}°C
							</DialogContentText>
						</DialogContent>
						<DialogActions>
						<Button
								variant="outlined"
								fullWidth
								component={RouterLink}
								to={{
									pathname: ROUTES.ORDER_SERVICE,
									search: "?id=" + this.state.orderID,
									state: {
										orderID: this.props.location.state.orderID,
										docID: this.props.location.state.docID,
										menu: this.props.location.state.menu
									}
								}}
							>
								Back to Heater Overview
							</Button>
						<Button
								variant="outlined"
								fullWidth
								component={RouterLink}
								to={{
									pathname: ROUTES.ORDER_TIMELINE,
									search: "?id=" + this.state.orderID,
									state: {
										orderID: this.props.location.state.orderID,
									}
								}}
							>
								Back to Timeline
							</Button>
						</DialogActions>
					</Dialog>
				</form>

				<br></br>
				<br></br>
				<Typography variant="h4" align="center">
					Temperature Dynamic Line Chart
				</Typography>
				<br></br>
				<CanvasJSChart
					options={options}
					onRef={ref => (this.chart = ref)}
				/>
				<Grid container spacing={1}>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink} to={{
								pathname: ROUTES.ORDER_TIMELINE,
								search: "?id=" + this.state.orderID
							}}>Back to Timeline
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								component={RouterLink} 
								to={ROUTES.LANDING}
								>Home
							</Button>
						</Grid>
					</Grid>
			</div>
		);
	}
}

const IoTHeater = withRouter(withFirebase(IoTHeaterBase));

export default IoTHeater;
