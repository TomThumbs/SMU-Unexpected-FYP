import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
// import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
	searchId: "",
	prevId: "",
	dateOfStorage: "",
	dateOfExpiry: "",
	ingredientName: "",
	ingredientId:""
};

class DisplayIngredientBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount() {
		this.props.firebase.fs
			.collection("Ingredients")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					// console.log(data);
					this.setState({
						[data.ingredientId]: {
							ingredientName: data.name,
							dateOfStorage: data.Date_of_Storage,
							dateOfExpiry: data.Date_of_expiry,
						}
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	onSubmit = event => {
		event.preventDefault();
		// console.log(this.state)
		const result = document.querySelector("#Result");

		// Remove existing result if any
		if (this.state.prevId !== "") {
			let old = result.querySelector(
				"[data-id=id" + this.state.prevId + "]"
			);
			result.removeChild(old);
		}
		// let searchID = this.state.searchId
		if (this.state.searchId in this.state) {
			// Add new result to display
			let div = document.createElement("div");
			let id = document.createElement("p");
			let name = document.createElement("p");
			let storagedate = document.createElement("p");
			let expirydate = document.createElement("p");

			div.setAttribute("data-id", "id" + this.state.searchId);
			// div.textContent = this.state.searchId;
			id.textContent = "Barcode: " + this.state.searchId;
			name.textContent = "Ingredient Name: " +this.state[this.state.searchId].ingredientName;
			storagedate.textContent = "Storage Date: " + this.state[this.state.searchId].dateOfStorage;
			expirydate.textContent = "Expiry Date: "+this.state[this.state.searchId].dateOfExpiry;

			div.appendChild(id);
			div.appendChild(name);
			div.appendChild(storagedate);
			div.appendChild(expirydate);
			result.appendChild(div);
			// console.log("zzzzz",div);
		} else {
			let error = document.createElement("p");
			error.setAttribute("data-id", "id" + this.state.searchId);
			error.textContent = "Item does not exist";
			result.appendChild(error);
			// console.log(error);
		}

		this.setState({
			prevId: this.state.searchId
		});
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log(event.target.value);
	};

	render() {
		let isInvalid = this.state.searchId === "";

		return (
			<Container component="main" maxWidth="xs">
				<form onSubmit={this.onSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="searchId"
						value={this.state.searchId}
						label="Search Ingredient ID"
						onChange={this.onChange}
						type="text"
						placeholder="Ingredient ID"
					/>
					<Button
						disabled={isInvalid}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						// classes={this.classes.submit}
					>
						Search
					</Button>
				</form>
				<br></br>
				<Paper margin="10px" variant="outlined" align="center" padding="10px" id="Result"></Paper>
			</Container>
		);
	}
}

const DisplayIngredient = withRouter(withFirebase(DisplayIngredientBase));

export default DisplayIngredient;
