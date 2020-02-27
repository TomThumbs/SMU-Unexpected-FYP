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

// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
	docID: "",
	orderID: "",

};

class OrderPreparationPostSopBase extends Component {

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.docID };
		// this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id")); 

		this.setState({
			orderID: urlId 
		});
	}

	renderBackButton() {
		return (
			<Link
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.props.location.orderID
				}}
			>
				<Button>Back</Button>
			</Link>
		);
	}

	render() {
		console.log(this.props.location);
		return (
			<div class="body">
				<Container component="main" maxWidth="xs">
				{this.renderBackButton()}
				<Typography variant="h5" component="h2">Head Chef: {this.props.location.headchef}</Typography>
				<Typography variant="h5" component="h2">Assistant A: {this.props.location.assistantA}</Typography>
				<Typography variant="h5" component="h2">Assistant B: {this.props.location.assistantB}</Typography>
				<FormControlLabel
				control={<Checkbox checked="true" name="hands"  value="remember" color="primary" />}
				label="Hands washed?"
				/>
				<FormControlLabel
				control={<Checkbox checked="true" name="workspace" value="remember" color="primary" />}
				label="Workspace clean?"
				/>
				<FormControlLabel
				control={<Checkbox checked="true" name="workspace" value="remember" color="primary" />}
				label="Clean workspace?"
				/>
				<FormControlLabel
				control={<Checkbox checked="true" name="workspace" value="remember" color="primary" />}
				label="Clean kitchen tools?"
				/>	
				<br></br>
				<Grid container spacing={3}>
					<Grid item xs spacing={3}>
						<img
							class="image"
							src={this.props.location.imageURL}
							alt="Delivery Van"
						></img>
					</Grid>
				</Grid>
				<br></br>

				<Typography variant="h6" component="h2">Order Commence: {this.props.location.preparationCommencement}</Typography>

				</Container>

			</div>
		);
	}
}

const OrderPreparationPostSop = withRouter(withFirebase(OrderPreparationPostSopBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationPostSop);