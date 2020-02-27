import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";

const useStyles = makeStyles(theme =>
	createStyles({
		// const useStyles = makeStyles({
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
	commencement: new Date()
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

		this.props.firebase.fs.collection("Catering_orders")
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

		this.props.firebase.fs.collection("Catering_orders")
		.where("orderID", "==", urlId)
		.get()
		.then(snap => {
			snap.forEach(doc => {
				// console.log(Object.values(doc.data().HeatersUsed))
				this.setState({
					docID: doc.id,
					IOTs: Object.values(doc.data().HeatersUsed)

				})
			});
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
	}




	onChange = event => {
		if (this.state.completion === false) { 
			this.setState({
				[event.target.name]: true 
			}) 
		} else {
			this.setState({
				[event.target.name]: false 
			}) 
		}
	}

	onSubmit = event => {
		event.preventDefault();

		this.state.IOTs.forEach(item=>{
			console.log(item)
			this.props.firebase.fs
			.collection("IoTHeaters")
			.where("ID", "==", item)
			.get()
			.then(snap => {
				snap.forEach(doc => {
					this.props.firebase.fs.collection("IoTHeaters")
					.doc(doc.id).update({
						status: "Unused",
						orderID: "Unused"
					})
				});
			})
		}) 

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(String(this.state.docID))
			.update({
				Status: "Order Completed",
				orderComplete: this.state.commencement
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
		let isInvalid = this.state.completion === false
		return (
			<div className="body">
				<Container component="main" maxWidth="xs" className={this.classes.root}>
					{this.renderBackButton()}
					<Paper className={this.classes.paper}>
						<Typography>Confirm Completion</Typography>
						<Typography>Order ID</Typography>
						<Typography>#{this.state.orderID}</Typography>

						<FormControlLabel
							control={
							<Checkbox
								onChange={this.onChange}
								name="completion"
								value="true"
								color="primary"
							/>}
							label="The order has been successfully completed!"
						/>
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
					</Paper>
				</Container>
			</div>
		);
	}
}

const OrderCompletion = withRouter(withFirebase(OrderCompletionBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderCompletion);
