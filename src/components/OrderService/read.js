import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		flexGrow: 1
// 	  },
// }));

const INITIAL_STATE = {
	docID: "",
	orderID: "",
	dataIsLoaded: false,
	heatersUsed: {}
};

class OrderServiceReadBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
			orderID: props.location.state.orderID,
			docID: props.location.state.docID,
			menu: props.location.state.menu
		};
		// this.classes = { useStyles };
	}

	componentDidMount() {
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.get()
			.then(doc => {
				let data = doc.data();
				this.setState({
					heatersUsed: data.HeatersUsed
				});
			});
	}

	// renderMenu() {
	// 	let result = [];
	// 	this.state.menu.forEach((dish, idx) => {
	// 		result.push(<Typography key={dish}>{dish}</Typography>);
	// 		result.push(
	// 			<Typography key={dish + " heater"}>Heater: {this.state.heatersUsed[dish]}</Typography>
	// 		);
	// 		result.push(
	// 			<Link
	// 				component={RouterLink}
	// 				to={{
	// 					pathname: ROUTES.SMART_HEATING,
	// 					search: "?id=" + this.state.heatersUsed[dish],
	// 					state: {
	// 						heaterID: this.state.heatersUsed[dish],
	// 						orderID: this.state.orderID,
	// 						dish: dish
	// 					}
	// 				}}
	// 				key={idx}
	// 			>
	// 				View >>
	// 			</Link>
	// 		);
	// 	});

	// 	return result;
	// }

	renderMenu() {
		let result = [];
		this.state.menu.forEach((dish, idx) => {
			result.push(
			
				
				<Grid item xs={4} key={dish}>
					<Paper variant="outlined">

						<div className="item-height-dish">
							<Grid item xs={12} >
								{dish} 
							</Grid>
						</div>
					
						<Grid item xs={12} >
							<Button
							fullWidth
							color="primary"
							variant="outlined"
							component={RouterLink}
							to={{
								pathname: ROUTES.SMART_HEATING,
								search: "?id=" + this.state.heatersUsed[dish],
								state: {
									heaterID: this.state.heatersUsed[dish],
									orderID: this.state.orderID,
									dish: dish
								}
							}}
							key={idx}
							>
								View
							</Button>
						</Grid>

				
					</Paper>
				</Grid>
			);
		});

		return result;
	}

	render() {
		console.log(this.state);
		return (
			<Container component="main" maxWidth="sm">
				<Typography gutterBottom variant="h4">Adjust Heater Temperature</Typography>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">Order Number: {this.state.orderID}</Typography>
					<Grid container justify="center" spacing={2}>
			
						{this.renderMenu()}
					</Grid>
				
					<br></br>
					<Grid container spacing={1}>
							

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

					
				</Paper>
			</Container>
		);
	}
}

const OrderServiceRead = compose(
	withRouter,
	withFirebase
)(OrderServiceReadBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderServiceRead);
