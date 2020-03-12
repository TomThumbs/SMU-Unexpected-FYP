import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import * as ROUTES from "../../constants/routes";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const INITIAL_STATE = {
	searchId: "",
	errorMsg: "",
};

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

class SearchOrderBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {}

	onSubmit = event => {
		event.preventDefault();
		// console.log(this.state.searchId);
		// const serch =
		// 
		let found = false
		this.props.firebase.fs
		.collection("Catering_orders")
		.where("orderID", "==", Number(this.state.searchId))
		.get()
		.then(snap => {
			// console.log("asdasds")
			snap.forEach(doc => {
			// let data = doc.data();
			
			// if (doc.exists) {
				found = true
				console.log("doc found")
				this.props.history.push({
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.searchId,
					state: {
						orderID: this.state.searchId,

					}
				});		
			})
			if (!found) {			
				this.setState({
				errorMsg:<Paper variant="outlined"><Typography variant="h7"><center>Order does not exist.</center></Typography></Paper>
			})}
		})
		// if (!this.state.found) {
		// 	// console.log("always")
		// 	this.setState({
		// 		errorMsg:<Paper variant="outlined"><Typography variant="h7"><center>Order does not exist.</center></Typography></Paper>
		// 	})
		// }
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		let isInvalid = this.state.searchId.length === 0;

		return (
		
			<Container component="main" maxWidth="xs">
			<Typography gutterBottom variant="h4">Search Order</Typography>
				<Paper>
				
					<form onSubmit={this.onSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							name="searchId"
							value={this.state.searchId}
							label="Search Order Number:"
							onChange={this.onChange}
							type="string"
							placeholder="Order Number:"
						/>
						<Button
							disabled={isInvalid}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							classes={this.classes.submit}
						>
							Search
						</Button>
					</form>
					
					{this.state.errorMsg}
				</Paper>
			</Container>
		
		);
	}
}

const SearchOrder = withRouter(withFirebase(SearchOrderBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(SearchOrder);
