import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import "date-fns";
// import { Link as RouterLink } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
// import DateFnsUtils from "@date-io/date-fns";
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import {
// 	MuiPickersUtilsProvider,
// 	KeyboardDatePicker
// } from "@material-ui/pickers";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as ROUTES from "../../constants/routes";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column"
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
	dateOfStorage: "",
	dateOfExpiry: "",
	ingredientName: "",
	ingredientId: "",
	searchId: "",
	commencement: new Date(),
	open: false
};

class DeleteIngredientForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {
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
			commencement: day + "/" + month + "/" + year + " " + hour + ":" + minute
		});

		this.props.firebase.fs
			.collection("Ingredients")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					let data = doc.data();
					// console.log(data.barcode);
					this.setState({
						[data.barcode]: {
							ingredientName: data.name,
							dateOfStorage: data.Date_of_Storage,
							dateOfExpiry: data.Date_of_expiry
						}
					});
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
			dateOfStorage: "",
			dateOfExpiry: "",
			ingredientName: "",
			ingredientId: "",
			searchId: ""
		});
		// window.location.reload(false);
	};

	handleHome = () => {
		this.setState({
			open: false
		});
		this.props.history.push({
			pathname: ROUTES.LANDING
		});
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log(this.state[event.target.value])
		if (event.target.value in this.state) {
			let dash = this.state[event.target.value].dateOfStorage.replace("/", "-");
			this.setState({
				dateOfStorage: this.createTextField(
					"dos",
					dash.replace("/", "-"),
					"Date of Storage",
					"DD/MM/YYYY"
				),
				dateOfExpiry: this.createTextField(
					"dos",
					this.state[event.target.value].dateOfExpiry,
					"Date of Expiry",
					"DD/MM/YYYY"
				),
				ingredientName: this.createTextField(
					"dos",
					this.state[event.target.value].ingredientName,
					"Ingredient Name",
					"Ingredient Name"
				)
			});
		} else {
			this.setState({
				dateOfStorage: "",
				dateOfExpiry: "",
				ingredientName: ""
			});
		}
	};

	createTextField = (name, temp, label, placeholder) => {
		// const read = readonly === "true"
		return (
			<TextField
				variant="outlined"
				margin="normal"
				fullWidth
				Disabled
				name={name}
				value={temp}
				label={label}
				// onChange={this.onChange}
				type="text"
				placeholder={placeholder}
			/>
		);
	};
	today = new Date();

	onSubmit = event => {
		event.preventDefault();

		this.props.firebase.fs
			.collection("IngredientsInventory")
			.where("barcode", "==", String(this.state.searchId))
			.get()
			.then(snap => {
				snap.forEach(doc => {
					this.props.firebase.fs.collection("IngredientsArchive").add({
						Date_of_Storage: doc.data().Date_of_Storage,
						Date_of_expiry: doc.data().Date_of_expiry,
						Primary_Ingredients: doc.data().Primary_Ingredients,
						barcode: doc.data().barcode,
						name: doc.data().name,
						reason: "Expired before use",
						Date_of_removal: this.state.commencement
					});
				});
			});

		this.props.firebase.fs
			.collection("IngredientsInventory")
			.where("barcode", "==", String(this.state.searchId))
			.get()
			.then(snap => {
				snap.forEach(doc => {
					this.props.firebase.fs
						.collection("Ingredients")
						.doc(doc.id)
						.delete();
				});
			});

		this.handleClickOpen();
	};

	render() {
		let isInvalid = this.state.dateOfExpiry === "";

		return (
			<Container component="main" maxWidth="xs">
				<Typography variant="h4" gutterBottom>
					Remove Ingredient
				</Typography>

				<Paper>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="searchId"
						value={this.state.searchId}
						label="Delete Ingredient"
						onChange={this.onChange}
						type="text"
						placeholder="Scan barcode here"
					/>
					{this.state.dateOfStorage}
					{this.state.dateOfExpiry}
					{this.state.ingredientName}
					<form onSubmit={this.onSubmit}>
						<br></br>
						<Button
							disabled={isInvalid}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							classes={this.classes.submit}
						>
							Delete
						</Button>
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
								Barcode: {this.state.searchId}, {this.state.ingredientName} has
								been deleted.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Grid container spacing={1}>
								<Grid item xs={1}>
									<Button onClick={this.handleClose} color="primary" autoFocus>
										Continue Deleting
									</Button>
								</Grid>
								<Grid item xs={1}>
									<Button onClick={this.handleHome} color="primary" autoFocus>
										Home
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

const DeleteIngredient = withRouter(withFirebase(DeleteIngredientForm));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(DeleteIngredient);
