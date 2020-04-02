import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import { withAuthorization } from "../Session";

import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		maxWidth: 400,
		textAlign: "center"
		// margin: `${theme.spacing(1)}px auto`,
		// padding: theme.spacing(2),
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
	createdOn: "",
	createdBy: "Kelvin",
	fulfilledOn: "",
	notification: "",
	custName: "",
	custHp: "",
	venue: "",
	deliveryTime: "",
	remarks: "",
	menu: [],
	ingredientsUsed: {},
	orderID: "",
	pax: "",
	deliveryDate: "",
	docID: "",
	dataIsLoaded: false,
	doneBy: {},
	doneByName: {}
};

class FinalOverviewBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: this.props.location.docID }; // docID: props.location.state.docID
		this.classes = { useStyles };
	}

	// onSubmit = event => {
	// 	this.props.history.push({
	// 		pathname: ROUTES.ORDER_TIMELINE,
	// 		search: "?id=" + this.props.location.orderID,
	// 	});
	// };

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));

		this.setState({
			orderID: urlId
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.onSnapshot(doc => {
				let data = doc.data();
				this.setState({
					createdOn: data.Created_On,
					createdBy: "Kelvin",
					fulfilledOn: data.orderComplete,
					notification: data.notified,
					venue: data.venue,
					deliveryTime: data.Time,
					menu: data.Menu,
					ingredientsUsed: data.IngredientsUsed,
					pax: data.Pax,
					deliveryDate: data.DateOnly,
					remarks: data.Remarks,
					doneBy: data.doneBy
				});

				// const doneByValues = Array.from(new Set(Object.values(data.doneBy)));
				// const doneByKey = Object.keys(data.doneBy);

				let doneByName = this.state.doneByName;

				this.props.firebase.fs
					.collection("Users")
					.get()
					.then(query => {
						query.forEach(doc2 => {
							if (
								this.state.doneBy["Order Received"] === doc2.id
							) {
								doneByName["Order Received"] = doc2.data().name;
							}
							if (
								this.state.doneBy["Order Completion"] ===
								doc2.id
							) {
								doneByName["Order Completion"] = doc2.data().name;
							}
							// if (doneByValues.indexOf(doc2.id) !== -1) {
							// 	doneByName[
							// 		doneByKey[doneByValues.indexOf(doc2.id)]
							// 	] = doc2.data().name;
							// }
						});
					});

				this.setState({
					doneByName: doneByName
				});

				this.props.firebase.fs
					.collection("Customers")
					.doc(data.Customer.id)
					.get()
					.then(docu => {
						this.setState({
							custName: docu.data().Name,
							custHp: docu.data().HP
						});
					});
				// console.log(this.state);
			});

		this.props.firebase.fs
			.collection("Ingredients")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					let ingtname = data.name;
					// ingtname = ingtname.toLowerCase();
					this.setState({
						// [data.name.toLowerCase()]: Number(data.barcode),
						[Number(data.barcode)]: ingtname
					});
				});

				this.setState({
					dataIsLoaded: true
				});
				// console.log(this.state)
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	renderMenu = () => {
		let listofmenu = [];
		// console.log(this.state.menu.length)
		let i = 0;
		for (i = 0; i < this.state.menu.length; i++) {
			let dish = this.state.menu[i];
			listofmenu.push(<li> {dish}</li>);

			// ingredientsID = this.state.ingredientsUsed[dish];
			// ingredientsID = ingredientsID.split(",");

			// ingredientsID.forEach(ingtID => {
			// 	let ingtname = this.state[ingtID]
			// 	listofmenu.push(<Typography variant="subtitle2" color="textSecondary"> &emsp; &emsp; {ingtname}: {ingtID}</Typography>)
			// });
			// listofmenu.push(<br/>);
		}
		return listofmenu[0];
	};

	renderRemarks() {
		// console.log(this.state)
		if (this.state.remarks.length !== 0) {
			let result = [];
			result.push(<br />);
			result.push(this.griditem("Remarks:", this.state.remarks));
			return result;
		}

		return [];
	}

	griditem(title, info) {
		return (
			<Grid container>
				<Grid item xs={5}>
					{title}
				</Grid>
				<Grid item xs={7}>
					<b>{info}</b>
				</Grid>
			</Grid>
		);
	}

	render() {
		let dataIsLoaded = this.state.dataIsLoaded === true;

		// console.log(this.state);

		return (
			<Container component="main" maxWidth="sm">
				<Typography variant="h4" gutterBottom>
					Order Overview
				</Typography>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">
						Order Number: {this.state.orderID}
					</Typography>
					<Typography component={"span"} variant="body1">
						{this.griditem("Created On:", this.state.createdOn)}

						{this.griditem("Created By:", this.state.doneByName["Order Received"])}
						{this.griditem("Collected By:", this.state.doneByName["Order Completion"])}
						{/* <Grid container>
							<Grid item xs={5}>
								Created By
							</Grid>
							<Grid item xs={7}>
								{Object.keys(this.state.doneByName).map(
									(status, index) => (
										<li>
											{status}:{" "}
											{this.state.doneByName[status]}
										</li>
									)
								)}
							</Grid>
						</Grid> */}
						{this.griditem("Fulfilled On:", this.state.fulfilledOn)}
						{this.griditem(
							"Notification Sent:",
							this.state.notification
						)}

						<br />

						{this.griditem("Customer Name:", this.state.custName)}
						{this.griditem("Customer HP No.:", this.state.custHp)}

						<br />

						{this.griditem("Delivery Venue:", this.state.venue)}
						{this.griditem(
							"Delivery Date:",
							this.state.deliveryDate
						)}
						{this.griditem(
							"Delivery Time:",
							this.state.deliveryTime
						)}
						{this.griditem("No. of Pax:", this.state.pax)}

						<br />

						{/* {this.griditem("Menu:", dataIsLoaded && this.renderMenu())} */}
						{/* <Grid container>
							<Grid item xs={5}>
								Menu:
							</Grid>
							<Grid item xs={7}>
								{dataIsLoaded && this.renderMenu()}
							</Grid>
						</Grid> */}
					</Typography>
					<br />

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

const FinalOverview = withRouter(withFirebase(FinalOverviewBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(FinalOverview);

// createdOn: "data.Created_On",
// createdBy:"Kelvin",
// fulfilledOn:"data.orderComplete",
// notification:"data.notified",
// venue:"data.venue",
// deliveryTime:"data.Time",
// menu:"data.Menu",
// pax:"data.Pax",
// deliveryDate:"data.DateOnly"
