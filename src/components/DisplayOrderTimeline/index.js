import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";

// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
// import Divider from '@material-ui/core/Divider';
// import Paper from '@material-ui/core/Paper';
// import TimelineItem from './timelineItem'

import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column"
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const INITIAL_STATE = {
	docID: "",
	orderID: "",
	statusList: [
		"Order Received",
		"Preparation",
		"Delivery",
		"Event in Progress",
		"Order Completed"
	],
	routeList: [
		ROUTES.ORDER_RECEIVED,
		ROUTES.ORDER_PREPARATION,
		ROUTES.ORDER_DELIVERY,
		ROUTES.ORDER_SERVICE,
		ROUTES.ORDER_COMPLETE
	],
	status: "",
	dataIsLoaded: false
};

class DisplayOrderTimelineBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		console.log(urlId);
		this.setState({
			orderID: urlId
		});

		console.log("Retreving doc");
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", urlId)
			.get()
			.then(querySnapshot => {
				// console.log(urlId);
				querySnapshot.forEach(doc => {
					console.log(doc.data());
					this.setState({
						docID: doc.id,
						status: doc.data().Status,
						menu: Array.from(new Set(doc.data().Menu)),
						sopStatus: doc.data().sop,
						statusDates: doc.data().StatusDates,
						dataIsLoaded: true

					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
		console.log("Retrieved doc");

		// this.setState({
		// 	dataIsLoaded: true
		// });
	}

	timelineItem(key, itemIndex, status) {
		console.log(this.state)
		const isDone =
			this.state.statusList.indexOf(itemIndex) <=
			this.state.statusList.indexOf(status);

		// Check if current item is preparation
		const isPrep = itemIndex === "Preparation";
		const isSop = itemIndex === "Preparation" && this.state.sopStatus === false;

		// Check if current item is to be delivered
		const makeDelivery = itemIndex === "Delivery" && status === "Preparation";

		// Check if order is delivered and to be set up
		const setUpService = itemIndex === "Event in Progress" && status === "Delivery";

		// Check if order is to be collected
		const toBeCollected =
			itemIndex === "Order Completed" && status === "Event in Progress";

		const routepath = this.state.routeList[
			this.state.statusList.indexOf(itemIndex)
		];

		let date = ''
		let statusDates = this.state.statusDates

		if(key <= 2){
			date = statusDates[key]
		}else{
			date = ''
		}

		return (
			<div key={key} className="timeline-item">
				<div className="timeline-item-content">
					<span className="tag">{itemIndex}</span>
					<hr/>
					{date !== '' ? (<span className="tag">{date}</span>) : null}

					{isPrep ? (
						<Link
							component={RouterLink} to={{
								pathname: ROUTES.ORDER_PREPARATION_EDIT,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID
								}
							}}
						><br></br>
							Edit
						</Link>
					) : null}
					{isSop ? (
						<Link
							component={RouterLink} to={{
								pathname: ROUTES.ORDER_PREPARATION_SOP,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID
								}
							}}
						><br></br>
							SOP
						</Link>
					) : null}
					{makeDelivery ? (
						<Link
							component={RouterLink} to={{
								pathname: ROUTES.ORDER_DELIVERY,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID
								}
							}}
						><br></br>
							Make Delivery
						</Link>
					) : null}
          			{setUpService ? (
						<Link
							component={RouterLink} to={{
								pathname: ROUTES.ORDER_SERVICE,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID,
									menu: this.state.menu,
									orderID: this.state.orderID
								}
							}}
						><br></br>
							Set up Temperature Monitors
						</Link>
					) : null}
					{toBeCollected ? (<Link
							component={RouterLink} to={{
								pathname: ROUTES.ORDER_COMPLETE,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID
								}
							}}
						><br></br>
							Items Collected
						</Link>) : null}
					{isDone ? (
						<Link
							component={RouterLink} to={{
								pathname: routepath,
								search: "?id=" + this.state.orderID,
								state: {
									docID: this.state.docID,
									menu: this.state.menu,
									orderID: this.state.orderID
								}
							}}
						><br></br>
							Read
						</Link>
					) : (
						<p>Not done yet</p>
					)}
					<span className="circle" />
				</div>
			</div>
		);
	}

	timeline() {
		return (
			<div className="timeline-container">
				{this.state.statusList.map((data, idx) =>
					this.timelineItem(idx, data, this.state.status)
				)}
			</div>
		);
	}

	render() {
		const dataIsLoaded = this.state.dataIsLoaded === true;

		return (
			<div className="body">
				<Container component="main" maxWidth="md">
					{dataIsLoaded && this.timeline()}
				</Container>
			</div>
		);
	}
}

const DisplayOrderTimeline = withRouter(withFirebase(DisplayOrderTimelineBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(DisplayOrderTimeline);
