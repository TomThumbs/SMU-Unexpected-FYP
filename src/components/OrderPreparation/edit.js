import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
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
	toDelete: {},
	menu: [],
	ingredientsUsed: "",
	dishIngredientsCheck: [],
	commencement: new Date(),
	userID: ""
};

class OrderPreparationEditBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			docID: props.location.state.docID,
			menu: props.location.state.menu,
			ingredientsUsed: props.location.state.ingredientsUsed
		};
		this.classes = { useStyles };
	}

	componentDidMount() {
		// ---------- RETRIEVE ORDER ID FROM URL ----------
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		this.setState({
			orderID: urlId
		});

		// ---------- DISPLAY COMMEMCEMENT IN STRING FORMAT ----------
		let day = String(this.state.commencement.getDate());
		let month = Number(this.state.commencement.getMonth()) + 1;
		let year = String(this.state.commencement.getFullYear());
		let hour = String(this.state.commencement.getHours());
		let minute = String(this.state.commencement.getMinutes());
		if (month.length === 1) {
			month = "0" + month;
		}
		if (hour.length === 1) {
			hour = "0" + hour;
		}
		if (minute.length === 1) {
			minute = "0" + minute;
		}
		this.setState({
			commencement:
				day + "/" + month + "/" + year + " " + hour + ":" + minute
		});

		// ---------- RETRIEVE CATERING ORDER ----------
		if (
			this.state.docID === "" ||
			this.state.menu === [] ||
			this.state.ingredientsUsed === undefined
		) {
			console.log("Retrieving Catering Order");
			this.props.firebase.fs
				.collection("Catering_orders")
				.where("orderID", "==", urlId)
				.get()
				.then(querySnapshot => {
					querySnapshot.forEach(doc => {
						let data = doc.data();
						this.setState({
							docID: doc.id,
							menu: Array.from(new Set(data.Menu)),
							doneBy: data.doneBy
						});
						if (data.IngredientsUsed !== null) {
							Object.keys(data.IngredientsUsed).forEach(dish => {
								this.setState({
									[dish + " barcodes"]: data.IngredientsUsed[
										dish
									]
								});
							});
						}
					});
				})
				.catch(function(error) {
					console.log("Error getting documents: ", error);
				});
		} else {
			Object.keys(this.state.ingredientsUsed).forEach(dish => {
				this.setState({
					[dish + " barcodes"]: this.state.ingredientsUsed[dish]
				});
			});
		}

		// ---------- RETRIEVE MENU INGREDIENTS ----------
		console.log("Retrieving Menu Ingredients");
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
		let todayTimestamp = new Date();
		todayTimestamp.setDate(todayTimestamp.getDate() - 1);
		todayTimestamp = Math.round(todayTimestamp.getTime() / 1000);
		// Get ingrediens which have not expired
		console.log("Retrieving Menu Ingredients");
		this.props.firebase.fs
			.collection("IngredientsInventory")
			.where("expiryTimestamp", ">=", todayTimestamp)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					let ingtname = data.name;
					this.setState({
						[Number(data.barcode)]: ingtname
					});
				});

				this.state.menu.forEach(dish => {
					let barcodes = this.state[dish + " barcodes"].split(",");

					barcodes.forEach(barcode => {
						barcode = barcode.trim();
						if (barcode in this.state) {
							this.setState({
								[dish + " " + this.state[barcode]]: true
							});
						}
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

		// ---------- RETRIVE USER ID ----------
		const userID = this.props.firebase.auth.currentUser.uid;
		this.setState({
			userID: userID
		});

		// console.log(this.state);
	}

	onSubmit = event => {
		event.preventDefault();
		// console.log(Object.keys(this.state.toDelete));
		let x = Object.keys(this.state.toDelete);
		let y = "";
		// let i = 0
		for (let i = 0; i < Object.values(this.state.toDelete).length; i++) {
			if (y.length === 0) {
				y = String(this.state.toDelete[x[i]]).split(",");
			} else {
				y = y + "," + String(this.state.toDelete[x[i]]).split(",");
			}
			// console.log(String(this.state.toDelete[x[i]]).split(","))
		}
		y = y.split(",");
		// console.log(typeof y)
		// let j = 0
		for (let j = 0; j < y.length; j++) {
			// console.log(Number(y[j]));
			this.props.firebase.fs
				.collection("IngredientsInventory")
				.where("barcode", "==", y[j])
				.get()
				.then(snap => {
					snap.forEach(doc => {
						this.props.firebase.fs
							.collection("IngredientsArchive")
							.add({
								Date_of_Storage: doc.data().Date_of_Storage,
								Date_of_expiry: doc.data().Date_of_expiry,
								Primary_Ingredients: doc.data()
									.Primary_Ingredients,
								barcode: doc.data().barcode,
								name: doc.data().name,
								reason: "Consumed in Preparation",
								Date_of_removal: this.state.commencement
							});
					});
				});
		}

		// let k = 0
		for (let k = 0; k < y.length; k++) {
			this.props.firebase.fs
				.collection("IngredientsInventory")
				.where("barcode", "==", y[k])
				.get()
				.then(snap => {
					snap.forEach(doc => {
						this.props.firebase.fs
							.collection("Ingredients")
							.doc(doc.id)
							.delete();
					});
				});
		}

		let ingredientsUsed = {};

		this.state.menu.forEach(dish => {
			let ingredients = this.state[dish + " barcodes"];
			ingredientsUsed = { ...ingredientsUsed, [dish]: ingredients };
		});

		// ---------- UPDATE CATERING ORDER STATUS IN FIRESTORE ----------
		// this.props.firebase.fs
		// 	.collection("Catering_orders")
		// 	.doc(this.state.docID)
		// 	.update({
		// 		Status: "Preparation"
		// 	})
		// 	.then(function() {
		// 		console.log("Document successfully written!");
		// 	})
		// 	.catch(function(error) {
		// 		console.error("Error writing document: ", error);
		// 	});

		// ---------- UPDATE CATERING ORDER INGREDIENTS USED IN FIRESTORE ----------
		const doneBy = this.state.doneBy;
		if (this.state.userID !== "") {
			doneBy["Preparation"] = this.state.userID;
		}

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				IngredientsUsed: ingredientsUsed,
				Status: "Preparation",
				doneBy: doneBy
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

	onClickTimeline = () => {
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
	};

	// Remove items if finished
	onItemTextRemove = dish => event => {
		let tempValue = event.target.value.trim();
		Object.assign(this.state.toDelete, { [dish]: tempValue });

		// this.setState({
		// 	[dish + " remove"]: tempValue
		// });
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
		// console.log(this.state)
		let list = [];
		this.state.menu.forEach((dish, id) => {
			// console.log(dish);
			// console.log(id);
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
								placeholder="Scan Barcode ID of the ingredient(s) used for this dish."
								value={this.state[dish + " barcodes"]}
								onChange={this.onItemTextChange(dish)}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography>Finished Ingredients</Typography>
							<TextareaAutosize
								aria-label="minimum height"
								rowsMin={3}
								placeholder="Scan Barcode ID of ingredient(s) fully utilised for this dish."
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
					search: "?id=" + this.state.orderID,
					state: {
						orderID: this.state.orderID
					}
				}}
			>
				Back
			</Button>
		);
	}

	render() {
		// console.log(this.state)
		let counter = 0;
		this.state.dishIngredientsCheck.forEach(item => {
			if (this.state[item] === true) {
				counter += 1;
			}
		});

		let completed = counter === this.state.dishIngredientsCheck.length;

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
						{/* {this.renderMenu()}  */}

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
										search: "?id=" + this.state.orderID,
										state: {
											orderID: this.state.orderID
										}
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
							<Grid container spacing={1}>
								<Grid item xs={12}>
									<Button
										onClick={this.onClickTimeline}
										color="primary"
										autoFocus
									>
										Back to Timeline
									</Button>
								</Grid>
							</Grid>
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
