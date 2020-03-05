import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import { Link as RouterLink } from 'react-router-dom';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import * as ROUTES from "../../constants/routes";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

class PostDeliveryFormBase extends Component {
	render() {
		console.log(this.props.location);
		return (
			
			<Container component="main" maxWidth="sm">
				
				<Typography gutterBottom variant="h4">Delivery Declaration</Typography>
				<Paper>
					<Typography variant="h6"><font color="#2e7d32">Submission Successful</font></Typography>
					<Typography variant="h6">Order Number: {this.props.location.orderID}</Typography>
					<Typography variant="body1">Name of Delivery Driver: {this.props.location.driver}</Typography>

					<p><Divider variant="li" /></p>
					
					<Grid container xs={12}>
						
						<Grid item xs={6}>
							<FormControlLabel
								control={<Checkbox checked="true" disabled color="primary" name="cleanReady" value="cleanReady"/>}
								label="Food securely packed?"
							/>
						</Grid>

						<Grid item xs>	
							<FormControlLabel
								control={<Checkbox checked="true" disabled color="primary" name="allItems" value="allItems"/>}
								label="Vehicle Clean?"
							/>		
						</Grid>
						
						<Grid item xs={6}>	
							<FormControlLabel
								control={<Checkbox checked="true" disabled color="primary" name="foodWrap" value="foodWrap"/>}
								label="No strong odors?"
							/>	
						</Grid>
						
						
						<Grid item xs>	
						 	<FormControlLabel
								control={<Checkbox checked="true" disabled color="primary" name="foodWrap" value="foodWrap"/>}
								label="Buffet decor loaded?"
							/>
						</Grid>
					</Grid>	
									
					
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
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink} to={{
								pathname: ROUTES.ORDER_TIMELINE,
								search: "?id=" + this.props.location.orderID
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

const PostDeliveryForm = withRouter(withFirebase(PostDeliveryFormBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(PostDeliveryForm);
