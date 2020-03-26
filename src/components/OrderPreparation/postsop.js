import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

// import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Link as RouterLink } from 'react-router-dom';

import { withAuthorization } from '../Session'

// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import * as ROUTES from "../../constants/routes";

class OrderPreparationPostSopBase extends Component {

	onSubmit = event => {
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.props.location.orderID,
			state: {
				orderID: this.props.location.orderID
			}
		});
	};

	render() {
		// console.log(this.props.location);
		return (
			<Container component="main" maxWidth="sm">
				<Typography gutterBottom variant="h4">Kitchen Declaration</Typography>
				<Paper>
					<Typography variant="h6"><font color="#2e7d32">Submission Successful</font></Typography>
					<Typography variant="h6">Order Number: {this.props.location.orderID}</Typography>
					<Typography variant="h6">Preparation commenced at: {this.props.location.preparationCommencement}</Typography>
					<Typography variant="body1">Head Chef: {this.props.location.headchef}</Typography>
					<Typography variant="body1">Assistant A: {this.props.location.assistantA}</Typography>
					<Typography variant="body1">Assistant B: {this.props.location.assistantB}</Typography>

					<p><Divider variant="li" /></p>


					<Grid container xs={12}>
						<Grid container xs={6}>
							<FormControlLabel
								control={<Checkbox checked="true" disabled name="hands"  value="remember" color="primary" />}
								label="Hands have been washed."
							/>
						</Grid>
						<Grid item xs>
							<FormControlLabel
								control={<Checkbox checked="true" disabled  name="workspace" value="remember" color="primary" />}
								label="No kitchen staff is currently feeling unwell."
							/>
						</Grid>
						<Grid item xs={6}>
							<FormControlLabel
								control={<Checkbox checked="true" disabled name="workspace" value="remember" color="primary" />}
								label="Kitchen worktops are clean."
							/>
						</Grid>
						<Grid item xs>
							<FormControlLabel
								control={<Checkbox checked="true" disabled name="workspace" value="remember" color="primary" />}
								label="Kitchen tools are clean."
							/>
						</Grid>
					</Grid>

					<br></br>
					<Grid container spacing={3}>
						<Grid item xs spacing={3}>
							<img
								class="image"
								src={this.props.location.imageURL}
								alt="Kitchen state"
							></img>
						</Grid>
					</Grid>
					<br></br>

					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink} to={{
								pathname: ROUTES.ORDER_TIMELINE,
								search: "?id=" + this.props.location.orderID,
								state: {
									orderID: this.state.orderID
								}
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

const OrderPreparationPostSop = withRouter(withFirebase(OrderPreparationPostSopBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationPostSop);