import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
// import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider';
// import Paper from "@material-ui/core/Paper";
import Box from '@material-ui/core/Box';

import checkingredients from "./checkingredients.png";
import recipecreation from "./recipecreation.png";
import simple from "./simpleing.png";
import complex from "./complexing.png";
import remove from "./removeing.png";

class IngredientManagementBase extends Component {
	render() {
		return (
			
			<Container component="main" maxWidth="lg">
				<Typography variant="h3" align="center" gutterBottom>
					Ingredient Management
				</Typography>
				
				<br></br>
				<br></br>
	
				
				<Grid container spacing={3} justify="center">
					

					<Grid container item xs={2}>
						<Button
							component={RouterLink}
							to={ROUTES.DISH_TO_INGREDIENT_FORM}>
							<Grid container justify="center" spacing={1}>
								<Box height="100px"></Box>
								<Grid item xs={12}>
									<img class="image"
										src={recipecreation}
										alt="recipecreation"/>
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Create<br></br>Recipe
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

					{/* <Divider orientation="vertical" flexItem /> */}
		
					<Grid container item xs={2}>
						<Button component={RouterLink} to={ROUTES.NEW_INGREDIENT_BASIC}>
							<Grid container justify="center" spacing={1}>
								
								<Grid item xs={12}>
									<img class="image" src={simple} alt="simple-ingredient" />
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Tag Raw Ingredient
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

					<Grid container item xs={2}>
						<Button component={RouterLink} to={ROUTES.NEW_INGREDIENT_COMPLEX}>
							<Grid container justify="center" spacing={1}>
								<Grid item xs={12}>
									<img class="image" 
									src={complex} 
									alt="complex-ingredient" />
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Tag Prepared Ingredient
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

					{/* <Divider orientation="vertical" flexItem /> */}

					<Grid container item xs={2}>
						<Button component={RouterLink} to={ROUTES.DISPLAY_INGREDIENT}>
							<Grid container justify="center" spacing={1}>
								<Grid item xs={12}>
									<img class="image"
										src={checkingredients}
										alt="checkingredients"/>
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Check Ingredient
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

					<Grid container item xs={2}>
						<Button component={RouterLink} to={ROUTES.NEW_INGREDIENT}>
							<Grid container justify="center" spacing={1}>
								<Grid item xs={12}>
									<img class="image"
										src={checkingredients}
										alt="checkingredients"/>
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Add brand new Ingredient
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

					{/* to change the route link  */}
					<Grid container item xs={2}>
						<Button component={RouterLink} to={ROUTES.DELETE_INGREDIENT}>
							<Grid container justify="center" spacing={1}>
								<Grid item xs={12}>
									<img class="image" 
									src={remove} 
									alt="remove-ingredient" />
								</Grid>
								<Grid item xs={12} align="center">
									<Typography component="h6" variant="h6">
										Remove Ingredient 
									</Typography>
								</Grid>
							</Grid>
						</Button>
					</Grid>

				</Grid>

				<br></br>
				<br></br>
				<br></br>
				<br></br>


			
					{/* <Box 
						display="flex" 
						flexDirection="row"
						p={1} 
						m={1} 
						bgcolor="background.paper"
						justifyContent="center">

						<Box p={1} bgcolor="grey.300" flexDirection="column" >
							
								<Box p={1} m={1} bgcolor="white" css={{ height: 50 }}>
									<img class="image" 
									src={remove} 
									alt="remove-ingredient" />
								</Box>
								<Box p={1} m={1} bgcolor="white">2</Box>
						
						</Box>
						<Box p={1} bgcolor="grey.300">
						Item 1
						</Box>
						<Box p={1} bgcolor="grey.300">
						Item 1
						</Box>
					</Box> */}
					
			
			
			</Container>

			
			
		);
	}
}

const IngredientManagement = withRouter(withFirebase(IngredientManagementBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(IngredientManagement);
