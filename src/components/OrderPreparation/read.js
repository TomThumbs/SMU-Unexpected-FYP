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
	kitchenImageURL:"",
	commence:"",
	searchId:""
};

class OrderPreparationBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, orderID: props.location.state.orderID }; //props.location.state.orderID
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
						statusDate: data.StatusDates[1]
					});
					// console.log(data.IngredientsUsed)
					//this stores ingredient IDs
					for (var key in data.IngredientsUsed){

						let splitIngredients = []
						splitIngredients = data.IngredientsUsed[key].split(",")
						// console.log(splitIngredients)
						let ingreDetails = []
						
						let dos = ""
						let doe = ""
						let ingrename = ""
						//this finds the ingredients details of each ingredient ID
						splitIngredients.forEach((element) => { 
							// console.log("ingre", element)
							this.props.firebase.fs
							.collection("Ingredients")
							.doc(element)
							.get()
							.then(query => {
								// console.log("thisdata", query.data())
								// query.forEach(doc => {
									let dos = query.data().Date_of_Storage,
									doe = query.data().Date_of_expiry,
									ingrename = query.data().name
								// })
								ingreDetails.push([query.data().name, element, query.data().Date_of_Storage, query.data().Date_of_expiry])
							})
							
							// console.log(ingreDetails)
						})
						// console.log(data.IngredientsUsed[key])
						this.setState({
							...this.state,
							menuIngreDict: {
								...this.state.menuIngreDict,
								[key]: ingreDetails
							// 	[key]: [
							// 		[spaghetti, 789, dos, doe],
							// 		[spaghetti, 789, dos, doe],
							// ]
								// [key]: data.IngredientsUsed[key]
							}
						})



						this.setState(
							{ menu: [...this.state.menu, key] }
						)

					}
				});
			})
	}

	onChange = event => {
		this.setState({
			chosenMenu: event.target.name
		});
		this.renderMenu();
	};

	onSubmit = event => {
			this.props.history.push({
			pathname: './order-preparation-post-sop',
			search: "?id=" + this.state.orderID,
			orderID: this.state.orderID,
			headchef: this.state.headchef,
			assistantA: this.state.assistantA,
			assistantB: this.state.assistantB,
			imageURL: this.state.kitchenImageURL,
			preparationCommencement: this.state.commence
		});
	};

	renderMenuItem(item, valuee) {
		// console.log(value)

//@james got bug here

		let menu = [];
		if (item !== undefined) {
			console.log("~~~~", Object.values(valuee))


			valuee.forEach((v)=> {
				console.log("============", v[0])
					menu.push(
						<tr>
							<td>{v[0]}</td>
							<td>{v[1]}</td>
							<td>{v[2]}</td>
							<td>{v[3]}</td>
						</tr>
					)
				})
			
				// menu.push(
				// 	<tr>
				// 		{/* ) */}
				// {/* menu.push( */}
				// 		<td >{item}</td>
				// 		<td >{value}</td>
				// 	</tr>

				// );
				// console.log(menu)
			;
		}
		return menu;
	}

	// ---------- Dish Selection ----------
	renderMenu() {
		let list = [];
		let altlist = [];
		// if (this.state.chosenMenu.length === 0) {
			list.push(
				<div>
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
			</div>
			)
		// }
		console.log(this.state)
		this.state.menu.forEach((item, id) => {
			
			// if (item === this.state.chosenMenu) {
				for (var key in this.state.menuIngreDict){
					// console.log(key,item)
					if (key === item) {
						altlist.push(
							<table>
								<tr>
									<th>Item</th>
									<th>Item ID</th>
								</tr>
								{this.renderMenuItem(key, this.state.menuIngreDict[key])}
								
							</table>
						);
					}
				};
				// console.log("===========")
				list.push(
					<div key={id}>
						<Paper className={this.classes.paper}>
							<Typography variant="h5">
								{item}
								{/* <Link name={item} onClick={this.onChange}>
									{item}
								</Link> */}
							</Typography>
						</Paper>
					</div>
					// push altlist here
				);
				list.push(altlist)
				altlist = []
			// } else {
			// 	list.push(
			// 		<div key={id}>
			// 			<Paper className={this.classes.paper}>
			// 				<Typography variant="h6" underline="none">
			// 					{" "}
			// 					<Link name={item} onClick={this.onChange}>
			// 						{item}
			// 					</Link>
			// 				</Typography>
			// 			</Paper>
			// 		</div>
			// 	);
			// }
		});

			// for (var key in this.state.menuIngreDict){
			// 	// if (key === this.state.chosenMenu) {
			// 		list.push(
			// 			<table>
			// 				<tr>
			// 					<th>Item</th>
			// 					<th>Item ID</th>
			// 				</tr>
			// 				{this.renderMenuItem(key, this.state.menuIngreDict[key])}
			// 			</table>
			// 		);
			// 	// }
			// };

		return list;
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
				<Container component="main" maxWidth="xs" className={this.classes.root}>
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
						{this.renderMenu()}
					</Paper>
				</Container>
		
		);
	}
}

const OrderPreparation = withRouter(withFirebase(OrderPreparationBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderPreparation);
