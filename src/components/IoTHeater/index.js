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
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import * as ROUTES from "../../constants/routes";
import Divider from '@material-ui/core/Divider';

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
		// console.log(num);
		// console.log(typeof num);
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
			<Container component="main" maxWidth="md">
				<Typography gutterBottom variant="h4">Heater Temperature Line Chart</Typography>
				<Paper>
				<Typography variant="h6" gutterBottom color="primary">Order Number: {this.state.orderID}</Typography>
				
				
				<Grid container> 
					<Grid item xs={6}>
						<Typography variant="subtitle2" color="textSecondary">Dish Name:</Typography>
						<Typography variant="h5">{this.state.dish}</Typography>
						<br></br>
						<Typography variant="subtitle2" color="textSecondary">Heater:</Typography>
						<Typography variant="h5">#{this.state.heaterID}</Typography>
					</Grid>
					
					<Grid item xs={6}>
						
						<Typography variant="body1">Temperature Threshold: {this.state.minTemp}</Typography>
						<Typography variant="body1">Current Temperature: {this.state.current}</Typography>

						<br></br>
					
						<Grid container item xs={12} alignItems="center" spacing={3}>
						
							<Grid item xs={6} >
								<TextField
									name="newMinTemp"
									value={newMinTemp}
									onChange={this.onChange}
									label="Set Threshold"
									type="number"
									variant="outlined"
									margin="dense"
									fullWidth
									required
									
								/>
							</Grid>

							<form onSubmit={this.onSubmit}>
							<Grid item  >
					
								<Button
								style={{ alignSelf: "center" }}
								// disabled={isInvalid}
								type="submit"
								variant="contained"
								color="primary"
								className={this.classes.submit}
								size="large"
								>
								Set
								</Button>
							</Grid>

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
							
								<Grid container spacing={1}>
									<Grid item xs={12}>
										<Button
											variant="outlined"
											autoFocus
											fullWidth
											onClick={this.handleClose} 
										>
											Back to Line Chart
										</Button>
									</Grid> 
									
									
									<Grid item xs={12}>
										<Button
											variant="outlined"
											autoFocus
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
									</Grid> 
								</Grid>
							</DialogActions>
						</Dialog>
					</form>
					
					
					</Grid>
				</Grid>
			</Grid>
				
				
				

				

				<p><Divider variant="li" /></p>
				
				{/* <Typography variant="h4" align="center">
					Temperature Dynamic Line Chart
				</Typography> */}
				<br></br>
				<CanvasJSChart
					options={options}
					onRef={ref => (this.chart = ref)}
				/>
				<br></br>
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
				</Paper>
			</Container>
		);
	}
}

const IoTHeater = withRouter(withFirebase(IoTHeaterBase));

export default IoTHeater;
