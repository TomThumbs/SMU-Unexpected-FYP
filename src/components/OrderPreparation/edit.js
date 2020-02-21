import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

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
	// statusList: ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete'],
	dateOnly: "",
	time: "",
	venue: "",
	pax: "",
	status: "",
	menu: []
	// menuIngredients:[]
};

class OrderPreparationEditBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		// console.log(urlId)
		this.setState({
			orderID: urlId
		});

		// ---------- RETRIEVE CATERING ORDER ----------
		console.log("Retreving Catering Order");
		this.props.firebase.fs
			.collection("Catering_orders")
			.where("orderID", "==", urlId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					this.setState({
						docID: doc.id,
						dateOnly: data.DateOnly,
						time: data.Time,
						venue: data.venue,
						pax: Number(data.Pax),
						status: data.Status,
						menu: Array.from(new Set(data.Menu))
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

		// ---------- RETRIEVE MENU INGREDIENTS ----------
		console.log("Retreving Menu Ingredients");
		this.props.firebase.fs
			.collection("Menu")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					if (this.state.menu.includes(data.name)) {
						this.setState({
							[data.name]: data.Ingredients
						});
						data.Ingredients.forEach(ingt => {
							let dishIngt = data.name + " " + ingt;
							this.setState({
								[dishIngt]: false
							});
						});
					}
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
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
					this.setState({
						// [data.name.toLowerCase()]: Number(data.barcode),
						[Number(data.barcode)]: ingtname
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	// onSubmit = event => {
	// 	event.preventDefault();

	// 	// ingredientTagsUsed is the equivalent of the TextareaAutosize. For whatever text in there, it splits by comma
	// 	// gets the RFID details and appends it to a new variable called ingredientsUsed
	// 	// then it writes to the db, under the name of Ingredients_Used.
	// 	let ingredientsTempList = this.state.ingredientTagsUsed.split(",");
	// 	let ingredientsTempListLength = ingredientsTempList.length;
	// 	for (var i = 0; i < ingredientsTempListLength; i++) {
	// 		//Get
	// 		this.props.firebase.fs
	// 			.collection("Ingredient")
	// 			.doc(ingredientsTempList[i])
	// 			.get()
	// 			.then(doc => {
	// 				this.setState(prevstate => ({
	// 					ingredientsUsed: [
	// 						...prevstate.ingredientsUsed,
	// 						doc.data().Name +
	// 							": " +
	// 							doc.data().Date_of_expiry +
	// 							", " +
	// 							ingredientsTempList[i]
	// 					]
	// 				}));
	// 				//Write
	// 				// Why this writing code is being initiated many times in this for loop is because ingredientsUsed becomes blank
	// 				// after this for loop is done. its weird. if this code is outside the for loop, itll write blank to the db.
	// 				this.props.firebase.fs
	// 					.collection("Catering_orders")
	// 					.doc(this.props.location.docID)
	// 					.update({
	// 						Ingredients_Used: this.state.ingredientsUsed
	// 					});
	// 			});
	// 	}

	// 	// console.log(this.state.docID);
	// 	this.props.firebase.fs
	// 		.collection("Catering_orders")
	// 		.doc(this.state.docID)
	// 		.update({
	// 			Status: "Preparation"
	// 		})
	// 		.then(function() {
	// 			console.log("Document successfully written!");
	// 		})
	// 		.catch(function(error) {
	// 			console.error("Error writing document: ", error);
	// 		});
	// };

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log(this.state);
	};

	// onMenuItemChange = (dish, ingt) => event => {
	// 	// if(this.state.menuIngredients[item])
	// 	let name = dish + " " + ingt;
	// 	this.setState({
	// 		...this.state,
	// 		[name]: !event.target.checked
	// 	});
	// 	// console.log(this.state[name]);
	// 	if (this.state[name] === true) {
	// 		console.log(this.state[name]);
	// 	}
	// };

	onItemTextChange = dish => event => {
		this.setState({
			[dish + " barcodes"]: event.target.value
		});
		let barcodes = event.target.value.split(",");

		const ingredients = this.state[dish];
		console.log(ingredients)

		ingredients.forEach(ingt => {
			let dishIngt = dish + " " + ingt;
			console.log(dishIngt)

			// if (true) {
			this.setState({
				[dishIngt]: false
			});
			// }
			// console.log(dishIngt);
			// console.log(this.state[dishIngt]);
			// console.log(this.state)
		});
		
		console.log(this.state)

		barcodes.forEach(barcode => {
			if (barcode in this.state) {
				// console.log(dish)
				// console.log(ingt)
				// console.log(dishIngt)
				// console.log(barcode)
				this.setState({
					[dish + " " + this.state[barcode]]: true
				});
			}
		}); // console.log(barcodes);

		console.log(this.state)
	};

	validator(dishIngt) {
		// console.log("Validator: " + dishIngt);
		return this.state[dishIngt] === true;
	}

	renderMenuItem(dish) {
		const ingredients = this.state[dish];

		let menu = [];

		if (ingredients !== undefined) {
			ingredients.forEach((ingt, id) => {
				let dishIngt = dish + " " + ingt; // E.g. Sweet and Sour Fish Fish

				menu.push(
					<div key={id}>
						<FormControlLabel
							control={
								<Checkbox
									disabled
									checked={this.validator(dishIngt)}
									// onChange={this.onMenuItemChange(item, ingt)}
									// name={dishIngt}
								/>
							}
							label={ingt}
						/>
					</div>
				);
			});
		}
		return menu;
	}

	renderMenu() {
		let list = [];
		// console.log(this.state);
		this.state.menu.forEach((dish, id) => {
			// let dishBarcodes = "";
			list.push(
				<div key={id}>
					<Paper className={this.classes.paper}>
						<Typography variant="h6">{dish}</Typography>
						{this.renderMenuItem(dish)}
						<TextareaAutosize
							aria-label="minimum height"
							rowsMin={3}
							placeholder="Minimum 3 rows"
							onChange={this.onItemTextChange(dish)}
							// name={dish + ' ' + barcodes}
						/>
					</Paper>
				</div>
			);
		});
		return list;
	}

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
		// console.log(this.state)
		return (
			<div className="body">
				<Container
					component="main"
					maxWidth="xs"
					className={this.classes.root}
				>
					{this.renderBackButton()}
					<Paper className={this.classes.paper}>
						<Typography>Order Preparation Edit</Typography>

						{/* <Grid container spacing={3}> */}
						<form onSubmit={this.onSubmit}>
							{this.renderMenu()}

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
						{/* </Grid> */}
					</Paper>
				</Container>
			</div>
		);
	}
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationEdit);
