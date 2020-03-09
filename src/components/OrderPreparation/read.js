import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
// import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as ROUTES from "../../constants/routes";

import { withAuthorization } from "../Session";

const StyledExpansionPanel = withStyles(() => ({
	disabled: {
		opacity: 1
	},
	
	root: {
		padding:0,
	},

	expanded: {
		padding: 0,
		margin: 0,
  }
}))(ExpansionPanel);

const useStyles = makeStyles(theme => ({	
	// submit: {
	// 	margin: theme.spacing(3, 0, 2)
	// },

	root: {
		padding: '100px',
	  },

	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	  },

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
	ingredients: {},
	dataIsLoaded: false
};


class OrderPreparationBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			orderID: props.location.state.orderID,
			headchef: props.location.state.headchef,
			assistantA: props.location.state.assistantA,
			assistantB: props.location.state.assistantB,
			kitchenImageURL: props.location.state.kitchenImageURL,
			commence: props.location.state.preparationCommencement,
			statusDates: props.location.state.StatusDates,
			menu: props.location.state.menu,
			ingredientsUsed: props.location.state.ingredientsUsed
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

		if (this.state.statusDates !== undefined) {
			this.setState({ statusDate: this.state.statusDates[1] });
		}

		// ---------- RETRIEVE INGREDIENTS ----------
		console.log("Retreving Menu Ingredients");
		this.props.firebase.fs
			.collection("IngredientsInventory")
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
				this.setState({ dataIsLoaded: true });
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});

		// ---------- RETRIEVE CATERING ORDER ----------
		if (
			this.state.orderID === undefined ||
			this.state.headchef === undefined ||
			this.state.assistantA === undefined ||
			this.state.assistantB === undefined
		) {
			console.log("Retreving Catering Order");
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
							ingredientsUsed: data.IngredientsUsed,
							
						});
					});
				});
		}
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
			<Grid item xs={2} key="Ingredient ID">
				<Typography gutterBottom><b>ID</b></Typography>
			</Grid>
		);
		ingts.push(
			<Grid item xs={4} key="Ingredient Name" align="right">
				<Typography gutterBottom><b>Name</b></Typography>
			</Grid>
		);
		ingts.push(
			<Grid item xs={3} key="Storage Date" align="right">
				<Typography gutterBottom><b>Storage Date</b></Typography>
			</Grid>
		);
		ingts.push(
			<Grid item xs={3} key="Expiry Date" align="right">
			<Typography gutterBottom><b>Expiry Date</b></Typography>
			</Grid>
		);

		let ingredients = this.state.ingredientsUsed[dish].split(",");

		ingredients.forEach(barcode => {
			ingts.push(
				<Grid item xs={2} key={barcode}>
					{barcode}
				</Grid>
			);
			ingts.push(
				<Grid item xs={4} key={barcode + " name"} align="right">
					{this.state.ingredients[barcode][0]}
				</Grid>
			);
			ingts.push(
				<Grid item xs={3} key={barcode + " storage"} align="right">
					{this.state.ingredients[barcode][1]}
				</Grid>
			);
			ingts.push(
				<Grid item xs={3} key={barcode + "expiry"} align="right">
					{this.state.ingredients[barcode][2]}
				</Grid>
			);
			
		});

		return ingts;
	}

	// ---------- Dish Selection ----------
	renderMenu() {
		let menu = [];

		this.state.menu.forEach(dish => {
			menu.push(
				<Grid container item>
					<Grid item xs={12}><Typography variant="h6" key={dish}> {dish} </Typography></Grid>
					<Grid item xs={12}><Typography variant="subtitle2" color="textSecondary" gutterBottom> List of Ingredients </Typography></Grid>
					<Grid container item>{this.renderMenuItem(dish)}</Grid>
				
				</Grid>
				
			);
		});

		return menu;
	}

	render() {
		const dataIsLoaded = this.state.dataIsLoaded === true;

		return (
			<Container component="main" maxWidth="sm" >
				<Typography variant="h4" gutterBottom>Preparation Details</Typography>
				
				
					<div className="root">
							{/* KITCHEN DECLARATION */}
						<StyledExpansionPanel>
							<ExpansionPanelSummary 

							aria-controls="panel1a-content"
							id="panel1a-header">
							
								<Typography variant="h6" color="primary">Order Number: {this.state.orderID}</Typography>
							</ExpansionPanelSummary>
						</StyledExpansionPanel>
						
						{/* INGREDIENTS */}
						<StyledExpansionPanel>
							<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
							>
								<Typography variant="h5">Kitchen Declaration</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
							
								
								<Grid item xs={12}>
									<Typography variant="h6"><font color="#2e7d32">Submission Successful</font></Typography>
									<Typography variant="body1" >Preparation commenced at: {this.state.preparationCommencement}</Typography>
									<Typography variant="body1" >Head Chef: {this.state.headchef}</Typography>
									<Typography variant="body1" >Assistant A: {this.state.assistantA}</Typography>
									<Typography variant="body1" >Assistant B: {this.state.assistantB}</Typography>

									<p><Divider variant="li" /></p>

									<Grid container xs={12}>
										<Grid container xs={6}>
											<FormControlLabel
												control={<Checkbox checked="true" disabled name="hands"  value="remember" color="primary" />}
												label="Hands washed?"
											/>
										</Grid>
										<Grid item xs>
											<FormControlLabel
												control={<Checkbox checked="true" disabled  name="workspace" value="remember" color="primary" />}
												label="Workspace clean?"
											/>
										</Grid>
										<Grid item xs={6}>
											<FormControlLabel
												control={<Checkbox checked="true" disabled name="workspace" value="remember" color="primary" />}
												label="Clean workspace?"
											/>
										</Grid>
										<Grid item xs>
											<FormControlLabel
												control={<Checkbox checked="true" disabled name="workspace" value="remember" color="primary" />}
												label="Clean kitchen tools?"
											/>
										</Grid>
									</Grid>
								

								<br></br>
						
									<Grid item xs={12}>
										<img
											class="image"
											src={this.state.kitchenImageURL}
											alt="Delivery Van"
										></img>
									</Grid>
								</Grid>
								<br></br>
							
							</ExpansionPanelDetails>
						</StyledExpansionPanel>

						<StyledExpansionPanel>
							<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
							>
								<Typography variant="h5">Ingredient List</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>

								<Grid container xs={12} spacing={3}>
							
								{dataIsLoaded && this.renderMenu()}

								</Grid>
							
							</ExpansionPanelDetails>
						</StyledExpansionPanel>

						<StyledExpansionPanel >
							<ExpansionPanelSummary 
							
							aria-controls="panel3a-content"
							id="panel3a-header"
							>
							<Grid container spacing={1}>
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
							</ExpansionPanelSummary>
						</StyledExpansionPanel>
					</div>
						
			
					
			</Container>
		);
	}
}

const OrderPreparation = withRouter(withFirebase(OrderPreparationBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderPreparation);
