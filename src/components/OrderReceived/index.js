import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

// import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import * as ROUTES from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

const INITIAL_STATE = {
	orderID: "",
	dateOnly: "",
	time: "",
	venue: "",
	pax: "",
	status: "",
	menu: [],
	remarks: "",
	doneBy: {}
};

class OrderReceivedBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		// console.log(urlId);
		this.setState({
			orderID: urlId
		});

		console.log("Retreving doc");
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", urlId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					this.setState({
						createdOn: data.Created_On,
						createdBy: "Kelvin",
						dateOnly: data.DateOnly,
						time: data.apmTime,
						venue: data.venue,
						pax: Number(data.Pax),
						status: data.Status,
						remarks: data.Remarks,
						menu: Array.from(new Set(data.Menu)),
						doneBy: data.doneBy
					});

					this.props.firebase.fs
						.collection("Customers")
						.doc(data.Customer.id)
						.get()
						.then(docu => {
							// console.log(docu.data());
							this.setState({
								custName: docu.data().Name,
								custHp: docu.data().HP
							});
						});

					this.props.firebase.fs
						.collection("Users")
						.doc(this.state.doneBy["Order Received"])
						.get()
						.then(doc => {
							// console.log(doc.data());
							this.setState({
								username: doc.data().name
							});
						});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	renderMenu() {
		let list = [];
		this.state.menu.forEach((item, id) => {
			list.push(<li key={id}>{item}</li>);
		});
		return list;
	}

	renderBackButton() {
		return (
			<Button
				component={RouterLink}
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID,
					state: {
						orderID: this.state.orderID
					}
				}}
			>
				{" "}
				Back
			</Button>
		);
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

	renderRemarks() {
		if (this.state.remarks.length !== 0) {
			let result = [];
			result.push(<br />);
			result.push(this.griditem("Remarks:", this.state.remarks));
			return result;
		}
	}

	render() {
		return (
			<Container component="main" maxWidth="md">
				<Typography gutterBottom variant="h4">
					Order Details
				</Typography>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">
						Order Number: {this.state.orderID}
					</Typography>
					<Typography variant="body1">
						<Grid container>
							<Grid item xs={7} className="side-border-right">
								{this.griditem(
									"Created On:",
									this.state.createdOn
								)}
								{this.griditem(
									"Created By:",
									this.state.username
								)}

								<br></br>

								{this.griditem(
									"Customer Name:",
									this.state.custName
								)}
								{this.griditem(
									"Customer HP No.:",
									this.state.custHp
								)}

								<br></br>

								{this.griditem(
									"Delivery Venue:",
									this.state.venue
								)}
								{this.griditem(
									"Delivery Date:",
									this.state.dateOnly
								)}
								{this.griditem(
									"Delivery Time:",
									this.state.time
								)}
								{this.griditem("No. of Pax:", this.state.pax)}

								{this.renderRemarks()}
							</Grid>

							<Divider orientation="vertical" flexItem />

							<Grid item xs={4} className="side-border-left">
								<b>Dishes ordered:</b>
								{this.renderMenu()}
							</Grid>
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
					</Typography>
				</Paper>
			</Container>
		);
	}
}

const OrderReceived = withRouter(withFirebase(OrderReceivedBase));

export default OrderReceived;
