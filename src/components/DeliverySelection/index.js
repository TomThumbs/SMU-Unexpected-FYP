import React, { Component } from "react";

import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { withAuthorization } from "../Session";

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(3)
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column"
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
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
	postalCode: "",
	time: "",
	pax: "",
	venue: "",
	temp_value: "",
	venueList: [],
	docIDList: [],
	orderIdList: [],
	today: "",
	docID: ""
};

class DeliverySelectionBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	onSubmit = event => {
		event.preventDefault();

		// this.props.firebase.fs
		// 	.collection("Catering_orders")
		// 	.where("venue", "==", this.state.postalCode)
		// 	.get()
		// 	.then(snapshot => {
		// 		snapshot.forEach(doc => {
		// 			console.log(doc.id);
		this.props.history.push({
			pathname: "./delivery-form",
			state: {
				docID: this.state.docID
			}
		});
		// });
		// });
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log(this.state.postalCode)
	};

	componentDidMount() {
		this.props.firebase.fs.collection("Customers").onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				let orderidnum = Number(change.doc.data().orderNumber);
				this.setState({
					orderID: orderidnum + 1,
					orderiddoc: change.doc.id
				});
			});
		});
		let startDate = new Date();
		startDate.setHours(0);
		startDate.setMinutes(0);
		let endDate = new Date();
		endDate.setHours(23);
		endDate.setMinutes(0);
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("Date", ">=", startDate)
			.where("Date", "<=", endDate)
			.orderBy("Date", "asc")
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					this.setState(prevstate => ({
						venueList: [...prevstate.venueList, doc.data().venue],
						docIDList: [...prevstate.docIDList, doc.id],
						orderIdList: [
							...prevstate.orderIdList,
							doc.data().orderID
						]
					}));
				});
			});
	}

	render() {
		return (
			<div class="body">
				<Container component="main" maxWidth="xs">
					<div>
						<FormControl
							component="fieldset"
							id="cafe-list"
							className={this.classes.formControl}
						>
							<FormLabel component="legend">
								<h2>Catering Events For The Day</h2>
							</FormLabel>
							<RadioGroup
								aria-label="postalCode"
								name="docID"
								id="cafe-list"
								value={this.value}
								onChange={this.handleChange}
							>
								{this.state.venueList.map((event, index) => (
									<FormControlLabel
										value={this.state.docIDList[index]}
										control={<Radio />}
										label={
											"Order #" +
											this.state.orderIdList[index]
										}
									/>
								))}
								<br></br>
							</RadioGroup>
						</FormControl>

						<form onSubmit={this.onSubmit}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={this.classes.submit}
							>
								Submit
							</Button>
						</form>
					</div>
				</Container>
			</div>
		);
	}
}

const DeliverySelection = withRouter(withFirebase(DeliverySelectionBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(DeliverySelection);
