import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		// maxWidth: 400,
		textAlign: "center",
		// margin: `${theme.spacing(1)}px auto`,
		height: 240,
		width: 400,
		padding: theme.spacing(2)
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	text: {
		textAlign: "center"
	}
}));

const INITIAL_STATE = {
	docID: "",
	orderID: "",
	dataIsLoaded: false,
	heatersUsed: {},
	counter: 0,
	temps:{},
	thresholds:{}
};

class OrderServiceReadBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			orderID: props.location.state.orderID,
			docID: props.location.state.docID,
			menu: props.location.state.menu
		};
		this.classes = { useStyles };
	}

	componentDidMount() {
		console.log(this.props.location.state)
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.get()
			.then(doc => {
				let data = doc.data();
				this.setState({
					heatersUsed: data.HeatersUsed
				});
			});
	}

	renderTemps(dish, dishname) {
					if (dish) {
					this.props.firebase.fs
					.collection("device_settings")
					.where("ID", "==", dish)
					.onSnapshot(changes => {
						// let changes = snapshot.docChanges(); //if a new value is keyed in, update the value
						changes.forEach(change => {
							// console.log(change.data(), "temp enters")
							if (this.state.counter <= Object.keys(this.state.heatersUsed).length) {
								let counta = this.state.counter+1
								this.setState({counter: counta})
								if (change.data().name === "temperature sensor") {
									// console.log(change.data().minimum)
									//set to dict
									Object.assign(this.state.thresholds, {[dishname]: change.data().minimum});
									this.setState({
										minTemp: change.data().minimum, //pulls from MINIMUM
										minTempDocID: change.id //the device settings doc id will change, so must update here for reference.
									});
								}
								this.props.firebase.fs.collection("IoTSensorLogs")
								// .where("ID", "==", dish)
								.orderBy("timestamp", "desc")
								// .limit(1)
								.onSnapshot(snapshot => {
									let changes = snapshot.docChanges();
									let counte = 0
									changes.forEach(change => {
										// console.log(changee.doc.data())
										if (change.doc.data().ID == dish && counte == 0) {
											counte = 1
											Object.assign(this.state.temps, {[dishname]: change.doc.data().temp});
											this.setState({
												temp:change.doc.data().temp,
											})
										}

									});
								});
							}
						});
					});
			}
	}

	renderMenu() {
		let result = [];
		this.state.menu.forEach((dish, idx) => {
			this.renderTemps(this.state.heatersUsed[dish], dish)
			// console.log("the state temp", this.state.temps)
		
			result.push(
			<Grid item xs={4} key={dish}>
					<Paper variant="outlined">

						<div className="item-height-dish">
							{dish} 
						</div>

						
						<Typography variant="caption">
						
						<p>
						Heater: {this.state.heatersUsed[dish]}
						<br></br>
						Current Temp.: {this.state.temps[dish]}°C
						<br></br>
						Threshold: {this.state.thresholds[dish]}
						</p>
						</Typography>
						
						
							<Button
							fullWidth
							color="primary"
							variant="outlined"
							component={RouterLink}
							to={{
								pathname: ROUTES.SMART_HEATING,
								search: "?id=" + this.state.heatersUsed[dish],
								state: {
									heaterID: this.state.heatersUsed[dish],
									orderID: this.state.orderID,
									dish: dish,
									docID: this.props.location.state.docID,
									menu: this.props.location.state.menu
								}
							}}
							key={idx}
							>
								View
							</Button>
						

				
					</Paper>
				</Grid>
			)
		});

		return result;
	}

	render() {
		// console.log(this.state);
		return (
			<Container component="main" maxWidth="sm">
				<Typography gutterBottom variant="h4">Adjust Heater Temperature</Typography>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">Order Number: {this.state.orderID}</Typography>
					<Grid container justify="center" spacing={2}>
			
						{this.renderMenu()}
					</Grid>
				
					<br></br>
					<Grid container spacing={1}>
							

						<Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink}
								to={{
									pathname: ROUTES.ORDER_TIMELINE,
									search: "?id=" + this.state.orderID,
									state: {
										orderID: this.state.orderID
									}
								}}
							>
								Back to Timeline
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								component={RouterLink}
								to={ROUTES.LANDING}
							>
								Home
							</Button>
						</Grid>
					</Grid>

					
				</Paper>
			</Container>
		);
	}
}

const OrderServiceRead = compose(
	withRouter,
	withFirebase
)(OrderServiceReadBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderServiceRead);
