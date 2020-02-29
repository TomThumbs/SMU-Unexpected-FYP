import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
	dateOnly: "",
	time: "",
	venue: "",
	pax: "",
	status: "",
	menu: [],
	IoTHeaters: [{ ID: 0, status: null }],
	dataIsLoaded: false,
	commencement: new Date (),
	StatusDates: ""
};

class OrderServiceBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			docID: props.location.state.docID,
			menu: props.location.state.menu,
			orderID: props.location.state.orderID
		};
		this.classes = { useStyles };
	}

	componentDidMount() {
		// console.log(this.props.location)	;
		this.props.firebase.fs
			.collection("IoTHeaters")
			.orderBy("ID", "asc")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					if (data.status === "Unused") {
						let tempHeater = {
							ID: data.ID,
							status: data.status,
							docID: doc.id
						};
						this.setState(prevState => ({
							IoTHeaters: [...prevState.IoTHeaters, tempHeater]
						}));
					}
				});
			});

		this.state.menu.forEach(dish => {
			this.setState({
				[dish + " heater"]: "0"
			});
		});

		this.setState({
			dataIsLoaded: true
		});

		let day = this.state.commencement.getDate()
		let month = Number(this.state.commencement.getMonth())+1
		let year = this.state.commencement.getFullYear()
		let hour = this.state.commencement.getHours()
		let minute = String(this.state.commencement.getMinutes())
		if (month.length === 1) {
			month = "0" + month
			}
		if (hour.length === 1) {
			hour = "0" + hour
			}
		if (minute.length === 1) {
			 minute = "0" + minute
			}
		this.setState({commencement: day + "/" + month + "/" + year + " " + hour + ":" + minute})

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.get()
			.then(doc => {
				this.setState({
					StatusDates: doc.data().StatusDates.concat(this.state.commencement)
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
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.state.orderID,
			state: {
				orderID: this.state.orderID
			}
		});
	};
	onSubmit = event => {
		event.preventDefault();

		this.props.firebase.fs
		.collection("Catering_orders")
		.doc(String(this.state.docID))
		.update({
			Status: "Event in Progress",
			StatusDates: this.state.StatusDates,
			orderComplete: this.state.commencement
		})
		.then(function() {
			console.log("Document successfully written!");
		})
		.catch(function(error) {
			console.error("Error writing document: ", error);
		});

		let heatersUsed = {};

		this.state.menu.forEach(dish => {
			let heater = this.state[dish + " heater"];
			heatersUsed = { ...heatersUsed, [dish]: heater };

			let heaterID = this.state.IoTHeaters[Number(heater)].docID;

			this.props.firebase.fs
				.collection("IoTHeaters")
				.doc(heaterID)
				.update({
					status: "In use",
					orderID: this.state.orderID
				});
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				HeatersUsed: heatersUsed
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});
		this.handleClickOpen();
	};

	onChange = dish => event => {
		this.setState({
			[dish + " heater"]: event.target.value
		});
	};

	renderHeaters() {
		let heaters = [];
		this.state.menu.forEach((dish, index) => {
			heaters.push(
				<Grid item xs={4} key={index}>
					<Paper className={this.classes.paper}>
						{dish}
						<br />
						<TextField
							id="standard-select"
							select
							label="Select Heater"
							value={this.state[dish + " heater"]}
							onChange={this.onChange(dish)}
							helperText="Please select the heater"
						>
							{this.state.IoTHeaters.map(option => (
								<MenuItem key={option.ID} value={option.ID}>
									Heater {option.ID}
								</MenuItem>
							))}
						</TextField>
					</Paper>
				</Grid>
			);
		});
		return heaters;
	}

	renderBackButton() {
		return (
			<Button
				variant="outlined"
				fullWidth
				component={RouterLink} to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				Back
			</Button>
		);
	}

	render() {
		const dataIsLoaded = this.state.dataIsLoaded === true;
		// console.log(this.state);
		return (
			<div className="body">
				<Container component="main" maxWidth="xs">
					<Typography variant="h2">
						Order #{this.state.orderID}
					</Typography>

					<Grid container justify="center" spacing={3}>
						{dataIsLoaded && this.renderHeaters()}
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
									The Raspberry Pi have been tagged.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary" autoFocus>
									Back to Timeline
								</Button>
							</DialogActions>
						</Dialog>

					<form onSubmit={this.onSubmit}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
						>
							Submit
						</Button>
					</form>
					<Grid item xs={12}>
					{this.renderBackButton()}
					</Grid>
				</Container>
			</div>
		);
	}
}

const OrderService = compose(withRouter, withFirebase)(OrderServiceBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderService);
