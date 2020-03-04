import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from 'react-router-dom';
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import { withAuthorization } from '../Session'

import * as ROUTES from "../../constants/routes";

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
	createdOn:"",
	createdBy:"Kelvin",
	fulfilledOn:"",
	notification:"",
	custName:"",
	custHp:"",
	venue:"",
	deliveryTime:"",
	menu:"",
	orderID:"",
	pax:"",
	deliveryDate:"",
	docID: ""
}

class FinalOverviewBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: this.props.location.docID };// docID: props.location.state.docID
		this.classes = { useStyles };
	}

	// onSubmit = event => {
	// 	this.props.history.push({
	// 		pathname: ROUTES.ORDER_TIMELINE,
	// 		search: "?id=" + this.props.location.orderID,
	// 	});
	// };

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id")); 

		this.setState({
			orderID: urlId 
		});

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.onSnapshot(doc => {
				let data = doc.data();
				this.setState({
					createdOn: data.Created_On,
					createdBy:"Kelvin",
					fulfilledOn:data.orderComplete,
					notification:data.notified,
					venue:data.venue,
					deliveryTime:data.Time,
					menu:data.Menu,
					pax:data.Pax,
					deliveryDate:data.DateOnly
				});
				this.props.firebase.fs
					.collection("Customers")
					.doc(data.Customer.id)
					.get()
					.then(docu => {
						console.log(docu.data())
						this.setState({
							custName:docu.data().Name,
							custHp:docu.data().HP,
						});
					});
			});
	}

	renderMenu = () => {
		let listofmenu = [];
		console.log(this.state.menu.length)
		let i = 0
		for (i = 0; i < this.state.menu.length; i++) {
			let dish = this.state.menu[i]
			listofmenu.push(<li> {dish}</li>);
		}	
		return listofmenu[0];
	}

	griditem(title,info){
		return (
			<Grid container> 
				<Grid item xs={5}>{title}</Grid>
				<Grid item xs={7}><b>{info}</b></Grid>
			</Grid>
		)
	}


	render() {
		return (
		
		<Container component="main" maxWidth="sm">
			<Typography variant="h4" gutterBottom>Order Overview</Typography>
			<Paper>

					<Typography variant="h6" gutterBottom>Order Number: {this.state.orderID}</Typography>
					<Typography variant="body1">

						{this.griditem("Created On:",this.state.createdOn)}
						{this.griditem("Created By:",this.state.createdBy)}
						{this.griditem("Fulfilled On:",this.state.fulfilledOn)}
						{this.griditem("Notification Sent:",this.state.notification)}
						
						<br></br>

						{this.griditem("Customer Name:",this.state.custName)}
						{this.griditem("Customer HP No.:",this.state.custHp)}
						
						<br></br>

						{this.griditem("Delivery Venue:",this.state.venue)}
						{this.griditem("Delivery Date:",this.state.deliveryDate)}
						{this.griditem("Delivery Time:",this.state.deliveryTime)}
						{this.griditem("No. of Pax:",this.state.pax)}

						<br></br>

						{this.griditem("Menu:",this.renderMenu())}

				</Typography>
				<br></br>
			

				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Button
							variant="outlined"
							fullWidth
							component={RouterLink} to={{
							pathname: ROUTES.ORDER_TIMELINE,
							search: "?id=" + this.state.orderID
						}}>Back to Timeline
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="outlined"
							color="primary"
							fullWidth
							component={RouterLink} 
							to={ROUTES.LANDING}
							>Home
						</Button>
					</Grid>
				</Grid>
			
			</Paper>
			
		</Container>
		
		);
	}
}

const FinalOverview = withRouter(withFirebase(FinalOverviewBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(FinalOverview);



// createdOn: "data.Created_On",
// createdBy:"Kelvin",
// fulfilledOn:"data.orderComplete",
// notification:"data.notified",
// venue:"data.venue",
// deliveryTime:"data.Time",
// menu:"data.Menu",
// pax:"data.Pax",
// deliveryDate:"data.DateOnly"