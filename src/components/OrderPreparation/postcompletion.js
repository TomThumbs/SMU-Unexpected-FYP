import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
						this.setState({
							custName:data.Name,
							custHp:data.HP,
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
			listofmenu.push(<p> {dish}</p>);
		}	
		return listofmenu;
	}

	render() {
		return (
			<div class="body">
				<Container component="main" maxWidth="xs">
				<Typography variant="h5" component="h2">Order Created: {this.state.createdOn}</Typography>
				<Typography variant="h5" component="h2">Order Created by: {this.state.createdBy}</Typography>
				<Typography variant="h5" component="h2">Order Fulfilled On: {this.state.fulfilledOn}</Typography>
				<Typography variant="h5" component="h2">Notification sent: {this.state.notification}</Typography>
				<br></br>
				<Typography variant="h5" component="h2">{this.state.custName}</Typography>
				<Typography variant="h5" component="h2">{this.state.custHp}</Typography>
				<br></br>
				<Typography variant="h5" component="h2">Deliver to:</Typography>
				<Typography variant="h5" component="h2">{this.state.venue}</Typography>
				<Typography variant="h5" component="h2">{this.state.deliveryDate}</Typography>
				<Typography variant="h5" component="h2">{this.state.deliveryTime}</Typography>

				<Typography variant="h5" component="h2">Menu ({this.state.pax} Pax)</Typography>
				{this.renderMenu()}

				</Container>
			</div>
		);
	}
}

const FinalOverview = withRouter(withFirebase(FinalOverviewBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(FinalOverview);