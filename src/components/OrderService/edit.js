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
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
// import { sizing } from "@material-ui/system";

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
	IoTHeaters: [{ ID: "", status: null }],
	dataIsLoaded: false,
	commencement: new Date(),
	StatusDates: "",
	heaterCheck: [],
	open: false,
	userID: ""
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
			// this.setState({
			// 	[dish + " heater"]: "0"
			// });
			let dishHeater = dish + " heater";
			this.setState(prevState => ({
				[dishHeater]: "",
				heaterCheck: [...prevState.heaterCheck, dishHeater]
			}));
		});

		this.setState({
			dataIsLoaded: true
		});

		let day = this.state.commencement.getDate();
		let month = Number(this.state.commencement.getMonth()) + 1;
		let year = this.state.commencement.getFullYear();
		let hour = this.state.commencement.getHours();
		let minute = String(this.state.commencement.getMinutes());
		if (month.length === 1) {
			month = "0" + month;
		}
		if (hour.length === 1) {
			hour = "0" + hour;
		}
		if (minute.length === 1) {
			minute = "0" + minute;
		}
		this.setState({
			commencement:
				day + "/" + month + "/" + year + " " + hour + ":" + minute
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.get()
			.then(doc => {
				this.setState({
					StatusDates: doc
						.data()
						.StatusDates.concat(this.state.commencement),
					doneBy: doc.data().doneBy
				});
			});

		// ---------- RETRIVE USER ID ----------
		const userID = this.props.firebase.auth.currentUser.uid;
		this.setState({
			userID: userID
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

		const doneBy = this.state.doneBy;
		if (this.state.userID !== "") {
			doneBy["Order Service"] = this.state.userID;
		}


		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(String(this.state.docID))
			.update({
				Status: "Event in Progress",
				StatusDates: this.state.StatusDates,
				orderComplete: this.state.commencement,
				doneBy: doneBy
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
		// console.log(this.state);
	};

	renderHeaters() {
		let heaters = [];
		this.state.menu.forEach((dish, index) => {
			heaters.push(
				<Grid item xs={4} key={index}>
					<Paper variant="outlined">
						<div className="item-height-dish">{dish}</div>

						<TextField
							fullWidth
							id="standard-select"
							select
							label="Select Heater"
							value={this.state[dish + " heater"]}
							onChange={this.onChange(dish)}
							//helperText="Please select the heater"
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
				component={RouterLink}
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID,
					state: {
						orderID: this.state.orderID
					}
				}}
			>
				Back
			</Button>
		);
	}

	renderDialogHeaters() {
		let heaters = [];
		this.state.menu.forEach(dish => {
			let heaterAssigned = this.state[dish + " heater"];
			heaters.push(
				<Typography key={dish}>
					{dish} : Heater {heaterAssigned}
				</Typography>
			);
		});
		return heaters;
	}

	render() {
		let counter = 0;
		let used = [];
		this.state.heaterCheck.forEach(item => {
			if (
				this.state[item] !== "0" &&
				this.state[item] !== 0 &&
				used.includes(this.state[item]) === false
			) {
				counter += 1;
				used.push(this.state[item]);
			}
		});
		let heaterCheck = counter === this.state.heaterCheck.length;
		// console.log(heaterCheck)
		const dataIsLoaded = this.state.dataIsLoaded === true;
		return (
			<Container component="main" maxWidth="sm">
				{/* <Typography variant="h2">Order #{this.state.orderID}</Typography> */}
				<Typography variant="h4" gutterBottom>
					Tag Heater to Dish
				</Typography>

				<Paper>
					<Typography variant="h6" gutterBottom color="primary">
						Order Number: {this.state.orderID}
					</Typography>
					<Grid container justify="center" spacing={2}>
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
								{this.renderDialogHeaters()}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={this.handleClose}
								color="primary"
								autoFocus
							>
								Back to Timeline
							</Button>
						</DialogActions>
					</Dialog>

					<br></br>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<form onSubmit={this.onSubmit}>
								<Button
									disabled={!heaterCheck}
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
								>
									Submit
								</Button>
							</form>
						</Grid>

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

const OrderService = compose(withRouter, withFirebase)(OrderServiceBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderService);
