import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';

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
import Grid from '@material-ui/core/Grid';

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
					if (data.IngredientsUsed !== null) {
						Object.keys(data.IngredientsUsed).forEach(dish => {
							this.setState({
								[dish + " barcodes"]: data.IngredientsUsed[dish]
							});
						});
					}
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

	onSubmit = event => {
		event.preventDefault();

		// ingredientTagsUsed is the equivalent of the TextareaAutosize. For whatever text in there, it splits by comma
		// gets the RFID details and appends it to a new variable called ingredientsUsed
		// then it writes to the db, under the name of Ingredients_Used.
		// let ingredientsTempList = this.state.ingredientTagsUsed.split(",");
		// let ingredientsTempListLength = ingredientsTempList.length;
		// for (var i = 0; i < ingredientsTempListLength; i++) {
		// 	//Get
		// 	this.props.firebase.fs
		// 		.collection("Ingredient")
		// 		.doc(ingredientsTempList[i])
		// 		.get()
		// 		.then(doc => {
		// 			this.setState(prevstate => ({
		// 				ingredientsUsed: [
		// 					...prevstate.ingredientsUsed,
		// 					doc.data().Name +
		// 						": " +
		// 						doc.data().Date_of_expiry +
		// 						", " +
		// 						ingredientsTempList[i]
		// 				]
		// 			}));
		//Write
		// Why this writing code is being initiated many times in this for loop is because ingredientsUsed becomes blank
		// after this for loop is done. its weird. if this code is outside the for loop, itll write blank to the db.
		// 			this.props.firebase.fs
		// 				.collection("Catering_orders")
		// 				.doc(this.props.location.docID)
		// 				.update({
		// 					Ingredients_Used: this.state.ingredientsUsed
		// 				});
		// 		});
		// }

		console.log(this.state.docID);
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				Status: "Preparation"
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});

		let ingredientsUsed = {};

		this.state.menu.forEach(dish => {
			let ingredients = this.state[dish + " barcodes"];
			ingredientsUsed = { ...ingredientsUsed, [dish]: ingredients };
		});

		console.log(ingredientsUsed);
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				IngredientsUsed: ingredientsUsed
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});

		this.handleClickOpen();
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleTimeline = () => {
		this.setState({
			open: false
		});
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.state.orderID,
			state: {
				orderID: this.state.orderID
			}
		});
	};

	onItemTextChange = dish => event => {
		let tempValue = event.target.value.trim();
		this.setState({
			// [dish + " barcodes"]: event.target.value
			[dish + " barcodes"]: tempValue
		});
		let barcodes = event.target.value.split(",");

		const ingredients = this.state[dish];
		// console.log(ingredients);

		ingredients.forEach(ingt => {
			let dishIngt = dish + " " + ingt;
			// console.log(dishIngt);

			this.setState({
				[dishIngt]: false
			});
		});

		// console.log(this.state);

		barcodes.forEach(barcode => {
			barcode = barcode.trim();
			if (barcode in this.state) {
				this.setState({
					[dish + " " + this.state[barcode]]: true
				});
			}
		});

		console.log(this.state);
	};

	validator(dishIngt) {
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
							control={<Checkbox disabled checked={this.validator(dishIngt)} />}
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
		this.state.menu.forEach((dish, id) => {
			list.push(
				<div key={id}>
		
					<Grid container style={{ paddingTop: 6, paddingBottom: 6}}>
						<Grid item xs={12}>
							<Typography variant="h6">{dish}</Typography>
						</Grid>
						
						<Grid item xs={12}>
							{this.renderMenuItem(dish)}
						</Grid>
						
						<Grid item xs={12}>
						<TextareaAutosize
							aria-label="minimum height"
							rowsMin={3}
							placeholder="Minimum 3 rows"
							value={this.state[dish + " barcodes"]}
							onChange={this.onItemTextChange(dish)}/>
						</Grid>
					</Grid>
					
			
				</div>
			);
		});
		return list;
	}

	renderBackButton() {
		return (
			<Button
				variant="outlined"
				fullWidth
				component={RouterLink} to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				Back
			</Button>
		);
	}

	render() {
		// console.log(this.state)
		return (
			<div className="body">
				<Container component="main" maxWidth="xs" className={this.classes.root}>
					
					<Paper className={this.classes.paper}>
						<Typography>Order Preparation Edit</Typography>

						<form onSubmit={this.onSubmit}>
							{this.renderMenu()}
							<br></br>
							<Grid container spacing={1}>
								<Grid item xs={12}>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										color="primary"
										className={this.classes.submit}
									>Submit
									</Button>
								</Grid>
								<Grid item xs={12}>
								{this.renderBackButton()}
								</Grid>
							</Grid>
						</form>
						
						
						
						
						<Dialog
							open={this.state.open}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{"Submission Notification"}
							</DialogTitle>
							<DialogContent dividers>
								<DialogContentText id="alert-dialog-description">
									Dish successfully tagged!
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleTimeline} color="primary" autoFocus>
									Back to Timeline
								</Button>
							</DialogActions>
						</Dialog>
					</Paper>
				</Container>
			</div>
		);
	}
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationEdit);
