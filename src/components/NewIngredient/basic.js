import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import "date-fns";
// import { Link as RouterLink } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from "@material-ui/pickers";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as ROUTES from "../../constants/routes";
// import Grid from "@material-ui/core/Grid";
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
	foodType: "",
	inputLabel: "",
	temp_tag: "",
	foodName: "",
	storageDate: "",
	expiryDate: null,
	open: false,
	foodId: "",
	month: "",
	availableIngredients: [],
	// priFoodId: ""
};

class NewBasicIngredientForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {
		// let queryString = window.location.search;
		// let urlParams = new URLSearchParams(queryString);
		// let urlId = urlParams.get("id");
		// // console.log(urlId)
		// this.setState({
		// 	foodId: urlId
		// });
		if (this.state.storageDate.length === 0) {
			let temp_date = new Date();
			let dd = String(temp_date.getDate()).padStart(2, "0");
			let mm = String(temp_date.getMonth() + 1).padStart(2, "0");
			let yyyy = temp_date.getFullYear();
			let string = dd + "/" + mm + "/" + yyyy;

			this.setState({
				storageDate: string
			});
		}
		this.props.firebase.fs.collection('Ingredients').get().then(snapshot=> {
			snapshot.forEach(doc => {
			  
			  this.setState((prevstate) => ({
				availableIngredients: [...prevstate.availableIngredients, {ingredient: doc.data().name}]
			  }));
			})
		  })
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.firebase.fs
			.collection("Ingredients")
			.doc(this.state.foodId)
			.set({
				barcode: this.state.foodId,
				Date_of_expiry:
					String(this.state.expiryDate).split(" ")[2] +
					"-" +
					this.state.month +
					"-" +
					String(this.state.expiryDate).split(" ")[3],
				name: this.state.foodName,
				Primary_Ingredients: "",
				Date_of_Storage: this.state.storageDate
			});

			this.props.firebase.fs
			.collection("IngredientsInventory")
			.doc(this.state.foodId)
			.set({
				barcode: this.state.foodId,
				Date_of_expiry:
					String(this.state.expiryDate).split(" ")[2] +
					"-" +
					this.state.month +
					"-" +
					String(this.state.expiryDate).split(" ")[3],
				name: this.state.foodName,
				Primary_Ingredients: "",
				Date_of_Storage: this.state.storageDate
			});
		this.handleClickOpen();
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
			foodId: "",
			expiryDate: "",
			foodName: "",
			// priFoodId: ""
		});
		window.location.reload(false);

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
		this.setState({ [event.target.name]: event.target.value });
	};

	handleDateChange = event => {


		if (event) {
			let tempMonth = (Number(event.getMonth()) + 1).toString();
			if (tempMonth.length === 1) {
				tempMonth = "0" + tempMonth;
			}
			this.setState({
				expiryDate: event,
				month: tempMonth
			});
		} else {

		}
		// console.log(this.state.date)
	};

	handleFillChange= name => event =>  {
		let dictIndex = event.target.id.split("-")[4]
		// console.log(this.state.foodName)
		// console.log(Object.values(this.state.availableIngredients)[dictIndex].ingredient)
		this.setState({...this.props, [name]: Object.values(this.state.availableIngredients)[dictIndex].ingredient});
	  }

	createTextField = (name, temp, label, placeholder) => {
		// const read = readonly === "true"
		return (
			<TextField
				variant="outlined"
				margin="normal"
				required
				fullWidth
				name={name}
				value={temp}
				label={label}
				onChange={this.onChange}
				type="text"
				placeholder={placeholder}
			/>
		);
	};
	today = new Date();

	render() {
		const isInvalid =
			this.state.storageDate === this.state.expiryDate ||
			this.state.foodName.length === 0;
		return (
				<Container component="main" maxWidth="xs">
					<Typography variant="h4"  gutterBottom>Tag Raw Ingredient</Typography>
					<Paper>
						{this.createTextField(
							"foodId",
							this.state.foodId,
							"Food ID",
							"Food ID"
						)}

						{/* Food Name */}
						{/* {this.createTextField(
							"foodName",
							this.state.foodName,
							"Food Name",
							"Food Name"
						)} */}

						<Autocomplete
						id="combo-box-demo"
						options={this.state.availableIngredients}
						getOptionLabel={option => option.ingredient}
						fullWidth
						onChange={this.handleFillChange("foodName")}  
						renderInput={params => (
							<TextField {...params} 
							label="Ingredient:" 
							variant="outlined" 
							margin="normal"
							fullWidth />
						)}
						/>

						{/* <TextField
							variant="outlined"
							margin="normal"
							fullWidth
							name="priFoodId"
							value={this.state.priFoodId}
							label="This is a complex ingredient and contains other ingredients"
							onChange={this.onChange}
							type="text"
							placeholder="Barcodes of other ingredients"
						/> */}

						{/* Storage Date */}
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="storageDate"
							value={this.state.storageDate}
							label="Date of Storage"
							onChange={this.onChange}
							type="text"
							placeholder="Date of Storage"
							InputProps={{
								readOnly: true
							}}
						/>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
									minDate={this.today}
									// InputLabelProps={{ shrink: true }}
									fullWidth
									margin="normal"
									inputVariant="outlined"
									label="Expiry Date:"
									format="dd/MM/yyyy"
									id="date-picker-inline"
									value={this.state.expiryDate}
									onChange={this.handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change date"
									}}
								/>
						</MuiPickersUtilsProvider>

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
									{this.state.foodName} has been tagged.
									<br />
									{/* Primary ingredients(if any):
									{this.state.priFoodId}
									<br /> */}
									Food ID: {this.state.foodId}
									<br />
									Storage Date: {this.state.storageDate}
									<br />
									Expiry Date:{" "}
									{String(this.state.expiryDate).split(
										" "
									)[2] +
										"/" +
										this.state.month +
										"/" +
										String(this.state.expiryDate).split(
											" "
										)[3]}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={this.handleClose}
									color="primary"
									autoFocus
								>
									Continue Tagging
								</Button>
								<Button
									onClick={this.handleHome}
									color="primary"
									autoFocus
								>
									Home
								</Button>
							</DialogActions>
						</Dialog>

						{/* <Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink} to={{
								pathname: ROUTES.NEW_INGREDIENT_COMPLEX,
								search: "?id=" + this.state.orderID
							}}>Complex Ingredient
							</Button>
							
						</Grid> */}

						<div><br></br></div>

						
						<form onSubmit={this.onSubmit}>
							<Button
								disabled={isInvalid}
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={this.classes.submit}
							>
								Submit
							</Button>
						</form>
					
					</Paper>
				</Container>
		
		);
	}
}

// NEW_INGREDIENT_COMPLEX

const NewBasicIngredient = withRouter(withFirebase(NewBasicIngredientForm));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewBasicIngredient);
