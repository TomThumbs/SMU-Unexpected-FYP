import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";

const useStyles = makeStyles(theme =>
	createStyles({
		root: {
			flexGrow: 1
		},
		paper: {
			marginTop: theme.spacing(8),
			display: "flex",
			flexDirection: "column",
			maxWidth: 400,
			textAlign: "center"
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
	})
);

const INITIAL_STATE = {
	open: false,
	docID: "",
	orderID: "",
	completion: false,
	status: "",
	IOTs: [],
	commencement: new Date(),
	StatusDates: ""
};

class OrderCompletionBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		this.setState({
			orderID: urlId
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", urlId)
			.get()
			.then(snap => {
				snap.forEach(doc => {
					if (doc.data().Status === "Order Completed") {
						// console.log(doc.id)
						this.props.history.push({
							pathname: ROUTES.FINAL_OVERVIEW,
							search: "?id=" + this.state.orderID,
							docID: doc.id
						});
					}
				});
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
			.where("orderID", "==", urlId)
			.get()
			.then(snap => {
				snap.forEach(doc => {
					console.log(Object.values(doc.data().HeatersUsed));
					console.log(
						doc.data().StatusDates.concat(this.state.commencement)
					);
					this.setState({
						docID: doc.id,
						IOTs: Object.values(doc.data().HeatersUsed),
						StatusDates: doc
							.data()
							.StatusDates.concat(this.state.commencement)
					});
				});
			});
	}

	onChange = event => {
		if (this.state.completion === false) {
			this.setState({
				[event.target.name]: true
			});
		} else {
			this.setState({
				[event.target.name]: false
			});
		}
	};

	onSubmit = event => {
		event.preventDefault();

		this.state.IOTs.forEach(item => {
			console.log(item);
			this.props.firebase.fs
				.collection("IoTHeaters")
				.where("ID", "==", item)
				.get()
				.then(snap => {
					snap.forEach(doc => {
						this.props.firebase.fs
							.collection("IoTHeaters")
							.doc(doc.id)
							.update({
								status: "Unused",
								orderID: "Unused"
							});
					});
				});
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(String(this.state.docID))
			.update({
				Status: "Order Completed",
				StatusDates: this.state.StatusDates
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});
		this.props.history.push({
			pathname: ROUTES.FINAL_OVERVIEW,
			search: "?id=" + this.state.orderID,
			docID: this.state.docID
		});
	};

	renderBackButton() {
		return (
			<Link
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				<Button>Back</Button>
			</Link>
		);
	}

	render() {
		let isInvalid = this.state.completion === false;
		return (
			<Container
				component="main"
				maxWidth="xs"
				className={this.classes.root}
			>
				<Typography gutterBottom variant="h4">
					Order Completion
				</Typography>
				<Paper className={this.classes.paper}>
					<Typography variant="h6">
						Confirm completion for Order #{this.state.orderID}.
					</Typography>

					<FormControlLabel
						control={
							<Checkbox
								onChange={this.onChange}
								name="completion"
								value="true"
								color="primary"
							/>
						}
						label="The order has been completed."
					/>

					<Grid container spacing={1}>
						<Grid item xs={12}>
							<form onSubmit={this.onSubmit}>
								<Button
									disabled={isInvalid}
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={this.classes.submit}
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
									search: "?id=" + this.props.location.orderID
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

const OrderCompletion = withRouter(withFirebase(OrderCompletionBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderCompletion);
