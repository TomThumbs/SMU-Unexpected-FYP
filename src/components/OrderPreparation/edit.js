import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

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
import Grid from "@material-ui/core/Grid";

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
	menu: [],
	// menuIngredients:[]
	dishIngredientsCheck: []
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
							this.setState(prevState => ({
								dishIngredientsCheck: [
									...prevState.dishIngredientsCheck,
									dishIngt
								]
							}));
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
			[dish + " barcodes"]: tempValue
		});
		let barcodes = event.target.value.split(",");

		const ingredients = this.state[dish];

		ingredients.forEach(ingt => {
			let dishIngt = dish + " " + ingt;

			this.setState({
				[dishIngt]: false
			});
		});

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

	// Remove items if finished
	onItemTextRemove = dish => event => {
		let tempValue = event.target.value.trim();
		this.setState({
			[dish + " remove"]: tempValue
		});
	};

	// Checks to ensure that item is checked
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
							control={
								<Checkbox
									disabled
									checked={this.validator(dishIngt)}
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
		this.state.menu.forEach((dish, id) => {
			list.push(
				<div key={id}>
					<Grid container style={{ paddingBottom: 18 }}>
						<Grid item xs={12}>
							<Typography
								variant="subtitle2"
								color="textSecondary"
							>
								Dish Name:
							</Typography>
							<Typography variant="h6">{dish}</Typography>
						</Grid>

						<Grid item xs={12}>
							{this.renderMenuItem(dish)}
						</Grid>

						<Grid item xs={6}>
							<Typography>Ingredient IDs</Typography>
							<TextareaAutosize
								aria-label="minimum height"
								rowsMin={3}
								placeholder="Ingredient ID"
								value={this.state[dish + " barcodes"]}
								onChange={this.onItemTextChange(dish)}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography>Finished Ingredients</Typography>
							<TextareaAutosize
								aria-label="minimum height"
								rowsMin={3}
								placeholder="Things to be removed"
								value={this.state[dish + " remove"]}
								onChange={this.onItemTextRemove(dish)}
							/>
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
				component={RouterLink}
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				Back
			</Button>
		);
	}

	render() {
		let counter = 0;
		this.state.dishIngredientsCheck.forEach(item => {
			if (this.state[item] === true) {
				counter += 1;
			}
		});

		let completed = counter === this.state.dishIngredientsCheck.length;

		console.log(completed);

		return (
			<Container
				component="main"
				maxWidth="xs"
				className={this.classes.root}
			>
				<Typography gutterBottom variant="h4">
					Tag Ingredients to Dish
				</Typography>
				<Paper className={this.classes.paper}>
					<Typography variant="h6" gutterBottom color="primary">
						Order Number: {this.state.orderID}
					</Typography>
					{this.renderMenu()}

					<form onSubmit={this.onSubmit}>
						{this.renderMenu()} 

						<Grid container spacing={1}>
							<Grid item xs={12}>
								<Button
									disabled={!completed}
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={this.classes.submit}
								>
									Submit
								</Button>
							</Grid>

							<Grid item xs={12}>
								<Button
									variant="outlined"
									fullWidth
									component={RouterLink}
									to={{
										pathname: ROUTES.ORDER_TIMELINE,
										search: "?id=" + this.state.orderID
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
							<Button
								onClick={this.handleTimeline}
								color="primary"
								autoFocus
							>
								Back to Timeline
							</Button>
						</DialogActions>
					</Dialog>
				</Paper>
			</Container>
		);
	}
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationEdit);
