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

class OrderPreparationPostSopBase extends Component {

	onSubmit = event => {
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.props.location.orderID,
		});
	};

	render() {
		// console.log(this.props.location);
		return (
			<div class="body">
				<Container component="main" maxWidth="xs">
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
				{/* <form onSubmit={this.onSubmit}>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={this.classes.submit}
					>
						Back To Order
					</Button>
				</form> */}
			</div>
		);
	}
}

const OrderPreparationPostSop = withRouter(withFirebase(OrderPreparationPostSopBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationPostSop);