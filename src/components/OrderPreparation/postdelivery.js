import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import * as ROUTES from "../../constants/routes";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

class PostDeliveryFormBase extends Component {
	render() {
		console.log(this.props.location);
		return (
			<div className="body">
				<Container component="main" maxWidth="xs">
					<Typography variant="h5" component="h2">
						Declaration for Order #{this.props.location.orderID} Successful.
					</Typography>
					<Typography variant="h6" component="h1">
						Driver: {this.props.location.driver}
					</Typography>
					<br></br>
					<Grid container spacing={3}>
						<Grid item xs spacing={3}>
							<img
								class="image"
								src={this.props.location.url}
								alt="Delivery Van"
							></img>
						</Grid>
					</Grid>
					<br></br>
					<Button
						href={ROUTES.LANDING}
						color="primary"
						fullWidth
						variant="contained"
					>
						Home
					</Button>
				</Container>
			</div>
		);
	}
}

const PostDeliveryForm = withRouter(withFirebase(PostDeliveryFormBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(PostDeliveryForm);
