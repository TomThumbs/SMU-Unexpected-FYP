import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import * as ROUTES from "../../constants/routes";

import { withAuthorization } from "../Session";

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
	chosenMenu: "",
	menuIngreDict: {},
	headchef: "",
	assistantA: "",
	assistantB: "",
	kitchenImageURL: "",
	commence: "",
	searchId: "",
	ingredients: {}
};

class OrderPreparationBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			orderID: props.location.state.orderID
		}; //props.location.state.orderID
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));

		this.setState({
			orderID: urlId
		});

		// ---------- RETRIEVE INGREDIENTS ----------
		console.log("Retreving Menu Ingredients");
		this.props.firebase.fs
			.collection("Ingredients")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					let ingtname = data.name;
					// ingtname = ingtname.toLowerCase();
					// this.setState({
					// 	// [data.name.toLowerCase()]: Number(data.barcode),
					// 	[Number(data.barcode)]: ingtname
					// });
					this.setState(prevState => ({
						ingredients: {
							...prevState.ingredients,
							[Number(data.barcode)]: [
								ingtname,
								data.Date_of_Storage,
								data.Date_of_expiry
							]
						}
					}));
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

		// ---------- RETRIEVE CATERING ORDER ----------
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", urlId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					this.setState({
						orderID: data.orderID,
						headchef: data.headchef,
						assistantA: data.assistantA,
						assistantB: data.assistantB,
						kitchenImageURL: data.kitchenImageURL,
						commence: data.preparationCommencement,
						statusDate: data.StatusDates[1],
						menu: data.Menu,
						ingredientsUsed: data.IngredientsUsed
					});
				});
			});
	}

	onChange = event => {
		this.setState({
			chosenMenu: event.target.name
		});
		this.renderMenu();
	};

	onSubmit = event => {
		this.props.history.push({
			pathname: "./order-preparation-post-sop",
			search: "?id=" + this.state.orderID,
			orderID: this.state.orderID,
			headchef: this.state.headchef,
			assistantA: this.state.assistantA,
			assistantB: this.state.assistantB,
			imageURL: this.state.kitchenImageURL,
			preparationCommencement: this.state.commence
		});
	};

	renderMenuItem(dish) {
		let ingts = [];

		ingts.push(
			<Grid item xs={3} key='Ingredient ID'>
				Ingredient ID
			</Grid>
		);
		ingts.push(
			<Grid item xs={3} key='Ingredient Name'>
				Ingredient Name
			</Grid>
		);
		ingts.push(
			<Grid item xs={3} key='Storage Date'>
				Storage Date
			</Grid>
		);
		ingts.push(
			<Grid item xs={3} key='Expiry Date'>
				Expiry Date
			</Grid>
		);

		let ingredients = this.state.ingredientsUsed[dish].split(",");

		ingredients.forEach(barcode => {
			ingts.push(
				<Grid item xs={3} key={barcode}>
					{barcode}
				</Grid>
			);
			ingts.push(
				<Grid item xs={3} key={barcode + " name"}>
					{this.state.ingredients[barcode][0]}
				</Grid>
			);
			ingts.push(
				<Grid item xs={3} key={barcode + ' storage'}>
					{this.state.ingredients[barcode][1]}
				</Grid>
			);
			ingts.push(
				<Grid item xs={3} key={barcode + 'expiry'}>
					{this.state.ingredients[barcode][2]}
				</Grid>
			);
		});

		return ingts;
	}

	// ---------- Dish Selection ----------
	renderMenu() {
		// console.log(this.state);
		let menu = [];

		this.state.menu.forEach(dish => {
			menu.push(
				<div key={dish}>
					<Typography variant="h4" key={dish}>
						{dish}
					</Typography>
					<Grid container>{this.renderMenuItem(dish)}</Grid>
				</div>
			);
		});

		return menu;
	}

	renderBackButton() {
		return (
			<Link
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID //+ this.state.orderID
				}}
			>
				<Button>Back</Button>
			</Link>
		);
	}

	render() {
		// console.log(this.state);
		return (
			<Container
				component="main"
				maxWidth="xs"
				className={this.classes.root}
			>
				{this.renderBackButton()}
				<Paper className={this.classes.paper}>
					<Typography variant="h3" align="center" gutterBottom>
						Preparation
					</Typography>
					<Typography variant="h4" align="center" gutterBottom>
						Order Number: {this.state.orderID}
					</Typography>
					<Typography variant="h6" align="center" gutterBottom>
						Ingredient Breakdown
					</Typography>
					<Paper className={this.classes.paper}>
						<Typography variant="h6" align="center" gutterBottom>
							Preparation Details
						</Typography>
						<Typography variant="h6" align="center" gutterBottom>
							Head Chef: {this.state.headchef}
						</Typography>
						<Typography variant="h6" align="center" gutterBottom>
							Assistant A: {this.state.assistantA}
						</Typography>
						<Typography variant="h6" align="center" gutterBottom>
							Assistant B: {this.state.assistantB}
						</Typography>
						<br></br>
						<Typography variant="h6" align="center" gutterBottom>
							Order Commence: {this.state.commence}
						</Typography>
						<form onSubmit={this.onSubmit}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={this.classes.submit}
							>
								Declaration
							</Button>
						</form>
					</Paper>
					{this.renderMenu()}
				</Paper>
			</Container>
		);
	}
}

const OrderPreparation = withRouter(withFirebase(OrderPreparationBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderPreparation);
