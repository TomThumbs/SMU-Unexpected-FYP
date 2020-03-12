import React, { Component } from "react";
import "../../App.css";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";
import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles(theme => ({
	formControl: {
		style: {
			minWidth: 300
		}
	},
	selectEmpty: {
		marginTop: theme.spacing(0)
	}
}));

const INITIAL_STATE = {
	menu: "",
	menu_List: [],
	chosen_menu: "",
	availableIngredients: [],
	newIngredientName: "",
	newDishName: "",
	dataIsLoaded: false,
	ingredients: []
};

class DishToIngredientFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE
		};
	}

	classes = useStyles;
	dishIngredients = [];

	componentDidMount() {
		this.props.firebase.fs
			.collection("Menu_Types")
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					this.setState(prevstate => ({
						menu_List: [...prevstate.menu_List, doc.id]
					}));
				});
			});

		let availableIngredients = new Set();

		this.props.firebase.fs
			.collection("Ingredients")
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					availableIngredients.add(doc.data().name);
				});
				availableIngredients.forEach(ingt => {
					this.setState(prevstate => ({
						availableIngredients: [
							...prevstate.availableIngredients,
							{ ingredient: ingt }
						]
					}));
				});
			});
	}

	addIngredient() {
		this.setState({ ingredients: [...this.state.ingredients, ""] });
		// console.log(this.state)
	}

	handleIngreChange(e, index) {
		//   console.log(e.target.data-option-index)
		if (e.target.id.length > 0) {
			let yolo = e.target.id.split("-")[4];
			let temp = Object.values(
				this.state.availableIngredients
			)[yolo].ingredient
			this.setState({
				[this.state.ingredients[index]]: temp
			})
			// this.state.ingredients[index] = Object.values(
			// 	this.state.availableIngredients
			// )[yolo].ingredient;
			this.setState({ ingredients: this.state.ingredients });
		}
	}

	handleRemove(index) {
		this.state.ingredients.splice(index, 1);
		console.log(this.state.ingredients, "$$$$");
		this.setState({ ingredients: this.state.ingredients });
	}

	handleMenuChange = event => {
		this.setState({
			chosen_menu: event.target.value
		});
	};

	onSubmit = event => {
		event.preventDefault();
		console.log(this.state);

		this.props.firebase.fs
			.collection("Menu")
			.doc(this.state.newDishName)
			.set({
				Ingredients: this.state.ingredients,
				Type: this.state.chosen_menu,
				name: this.state.newDishName
			});
		// } else {
		// 	this.props.firebase.fs
		// 		.collection("Ingredients")
		// 		.doc(this.state.newIngredientName)
		// 		.set({
		// 			// Properties:''
		// 			name: this.state.newIngredientName
		// 		});
		// }
		this.handleClickOpen();
	};

	handleChange = name => event => {
		if (event.target.id.length > 0) {
			let dictIndex = event.target.id.split("-")[4];
			// console.log(Object.values(this.state.availableIngredients)[dictIndex].ingredient)
			// this.state.ingredients[index] = Object.values(this.state.availableIngredients)[
			// 	dictIndex
			// ].ingredient
			// this.setState({ingredients: this.state.ingredients})

			this.setState({
				...this.props,
				[name.fooditem]: Object.values(this.state.availableIngredients)[
					dictIndex
				].ingredient
			});
		}
	};



	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
			menu: "",
			menu_List: [],
			chosen_menu: "",
		
			availableIngredients: [],
			newIngredientName: "",
			newDishName: ""
		});
		window.location.reload(true);
	};

	handleHome = () => {
		this.setState({
			open: false
		});
		this.props.history.push({
			pathname: ROUTES.LANDING
		});
	};

	createTextField = fooditem => {
		return (
			<Autocomplete
				id="combo-box-demo"
				options={this.state.availableIngredients}
				getOptionLabel={option => option.ingredient}
				fullWidth
				onChange={this.handleChange({ fooditem })}
				renderInput={params => (
					<TextField
						{...params}
						label="Ingredient:"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		);
	};

	renderSubmit() {
		if (
			this.state.newDishName.length === 0 ||
			this.state.chosen_menu.length === 0 ||
			this.state.ingredients.length <   2
		) {
			return (
				<Typography variant="subtitle2" color="secondary">
					Please enter a dish or ingredient.
				</Typography>
			);
		} else {
			return (
				<form onSubmit={this.onSubmit}>
					<Button
						fullWidth
						type="submit"
						variant="contained"
						color="primary"
						className={this.classes.submit}
					>
						Submit
					</Button>
				</form>
			);
		}
	}
	
	render() {
		// console.log(this.state);
		// const isLoaded = this.state.dataIsLoaded === true;
		return (
			<Container component="main" maxWidth="xs">
				<Typography variant="h4" gutterBottom>
					Recipe Creation
				</Typography>
				<Paper>
					<React.Fragment>
						<TextField
							required
							margin="normal"
							fullWidth
							name="newDishName"
							value={this.state.newDishName}
							label="Dish name:"
							onChange={this.onChange}
							type="text"
							placeholder="Dish name:"
						/>

						{/* <TextField
											required
											margin="normal"
											fullWidth
											name="newIngredientName"
											value={this.state.newIngredientName}
											label="New Ingredient:"
											onChange={this.onChange}
											type="text"
											placeholder="New Ingredient:"
											/> */}

						<TextField
							select
							label="Select Dish Type:"
							required
							fullWidth
							value={this.state.chosen_menu}
							onChange={this.handleMenuChange}
							margin="normal"
						>
							{this.state.menu_List.map((event, index) => (
								<MenuItem value={event}>{event}</MenuItem>
							))}
						</TextField>

						<div>
							<br></br>
						</div>
						<Typography variant="h5" gutterBottom>
							Ingredients
						</Typography>

						{this.state.ingredients.map((ingredient, index) => {
							return (
								<Grid
									container
									spacing={1}
									className="full-size"
									key={index}
								>
									<Grid item xs={10}>
										<Autocomplete
											id="combo-box-demo"
											options={
												this.state.availableIngredients
											}
											getOptionLabel={option =>
												option.ingredient
											}
											fullWidth
											required
											onChange={e =>
												this.handleIngreChange(e, index)
											}
											renderInput={params => (
												<TextField
													{...params}
													label="Ingredient:"
													variant="outlined"
													fullWidth
													required
												/>
											)}
										/>
									</Grid>
									<Grid item xs>
										<IconButton
											aria-label="remove"
											onClick={e =>
												this.handleRemove(index)
											}
										>
											<HighlightOffIcon fontSize="medium" />
										</IconButton>

										<div>
											<br></br>
										</div>

										{/* <Button 
										onClick={(e)=>this.handleRemove(index)}
										size="large"
										>
											<HighlightOffIcon />
										</Button> */}
									</Grid>
								</Grid>
							);
						})}

						{/* <hr /> */}

		
					</React.Fragment>

					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Button
								fullWidth
								variant="outlined"
								onClick={e => this.addIngredient(e)}
							>
								Add ingredient
							</Button>
						</Grid>

						<Grid item xs={12}>
							{this.renderSubmit()}
						</Grid>
					</Grid>

					<Dialog
						open={this.state.open}
						onClose={this.handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{"Submission Notification"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{this.state.newDishName} recipe has been
								created.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Button
										onClick={this.handleClose}
										color="primary"
										autoFocus
									>
										Create another recipe
									</Button>
								</Grid>
								<Grid item xs={12}>
									<Button
										onClick={this.handleHome}
										color="primary"
										autoFocus
									>
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

const DishToIngredientForm = withRouter(withFirebase(DishToIngredientFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(DishToIngredientForm);
