import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

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
	docID: "",
	orderID: "",
	menu: [],
	IngredientsUsed: [],
	Ingredient: "",
	Tag: "",
	chosenMenu: ""
};

class OrderPreparationEditBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: "28" }; //props.location.state.docID
		this.classes = { useStyles };
	}

	mmenu = "";

	componentDidMount() {
		// let queryString = window.location.search;
		// let urlParams = new URLSearchParams(queryString);
		// let urlId = "28" //Number(urlParams.get("id"));

		this.setState({
			orderID: "28" // urlId,
		});

		// ---------- RETRIEVE CATERING ORDER ----------
		console.log("Retrieving Catering Order");
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", 28) //urlId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					this.mmenu = Array.from(new Set(data.Menu));

					// ---------- RETRIEVE MENU INGREDIENTS ----------
					this.mmenu.forEach((item, id) => {
						//supposed to be doing a multi one already. This hinges on how data is uploaded from order prep
						// let spacetrim = item.replace(/\s/g,'')
						// spacetrim = spacetrim.replace('&','')
						// console.log(spacetrim)

						this.setState({
							[item]: data.SweetSourFish // the problem. i cannot use space trim, & trim, trimmed stuff.
							// i tried data.spacetrim doesnt work
						});
					});

					this.setState({
						docID: doc.id,
						menu: Array.from(new Set(data.Menu)),
						IngredientsUsed: Array.from(new Set(data.Ingredients_Used)),
						chosenMenu: data.Menu[0]
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	onChange = event => {
		this.setState({
			chosenMenu: event.target.name
		});
		this.renderMenu();
	};

	renderMenuItem(item) {
		const ingredients = this.state[item];
		// console.log(ingredient)
		let menu = [];
		if (ingredients !== undefined) {
			ingredients.forEach((ingt, id) => {
				menu.push(
					<tr>
						<td key={id}>{ingt.split(":")[0]}</td>
						<td key={id}>{ingt.split(", ")[1]}</td>
					</tr>
				);
			});
		}
		return menu;
	}

	renderMenu() {
		let list = [];
		this.state.menu.forEach((item, id) => {
			if (item === this.state.chosenMenu) {
				list.push(
					<div key={id}>
						<Paper className={this.classes.paper}>
							<Typography variant="h5">
								<Link name={item} onClick={this.onChange}>
									{item}
								</Link>
							</Typography>
						</Paper>
					</div>
				);
			} else {
				list.push(
					<div key={id}>
						<Paper className={this.classes.paper}>
							<Typography variant="h6" underline="none">
								{" "}
								{/*Problem: I cant remove the underline. Think ans is here: https://material-ui.com/api/link/    */}
								<Link name={item} onClick={this.onChange}>
									{item}
								</Link>
							</Typography>
						</Paper>
					</div>
				);
			}
		});

		if (this.state.menu.length !== 0) {
			// console.log("chosen menu is ", this.state.chosenMenu);
			this.state.menu.forEach((item, id) => {
				if (item === this.state.chosenMenu) {
					list.push(
						<table>
							<tr>
								<th>Item</th>
								<th>Item ID</th>
							</tr>
							{this.renderMenuItem(item)}
						</table>
					);
				}
			});
		} else {
			// console.log("chosen menu is empty.");
			list.push(
				<div>
					<Paper className={this.classes.paper}>
						<table>
							<tr>
								<th>Item</th>
								<th>Item ID</th>
							</tr>
						</table>
					</Paper>
				</div>
			);
		}
		return list;
	}

	renderBackButton() {
		return (
			<Link
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=29" //+ this.state.orderID
				}}
			>
				<Button>Back</Button>
			</Link>
		);
	}

	render() {
		// console.log(this.state);
		return (
			<Container component="main" maxWidth="xs" className={this.classes.root}>
				{this.renderBackButton()}
				<Paper className={this.classes.paper}>
					<Typography variant="h4" align="center" gutterBottom>
						Order ID #{this.state.orderID}
					</Typography>
					<Typography variant="h6" align="center" gutterBottom>
						Ingredient Breakdown
					</Typography>

					{this.renderMenu()}
				</Paper>
			</Container>
		);
	}
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));

export default OrderPreparationEdit;
