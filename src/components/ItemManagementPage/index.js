import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session'
import * as ROUTES from '../../constants/routes';
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from 'react-router-dom';

// import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import checkingredients from "./checkingredients.png";
import tagnew from "./tagnew.png";
import tagtoorder from "./tagtoorder.png";
import recipecreation from "./recipecreation.png";

class IngredientManagementBase extends Component {
	
    
    render() {
        
        return(
        <div className="body">
             <Container component="main" maxWidth="md">

                <Typography component="h4" variant="h4">Ingredient Management</Typography>
                <br></br>

                {/* <Button href={ROUTES.ORDER_FORM}><img class="image" src={tagnew} alt="logo"/></Button> */}
                
          
                <Grid container spacing={10}>
                    <Grid container item xs >
                        <Button component={RouterLink} to={ROUTES.NEW_INGREDIENT}>
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={12}>
                                    <img class="image" src={tagnew} alt="logo"/>
                                </Grid>
                                <Grid item xs={12} align="center" spacing={3}>
                                    <Typography component="h6" variant="h6">Tag New Ingredient</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    
                    <Grid container item xs >
                        <Button component={RouterLink} to={ROUTES.DISH_TO_INGREDIENT_FORM}>
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={12}>
                                    <img class="image" src={recipecreation} alt="recipecreation"/>
                                </Grid>
                                <Grid item xs={12} align="center" spacing={3}>
                                    <Typography component="h6" variant="h6">Create Recipe</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>

                    <Grid container item xs >
                        <Button component={RouterLink} to={ROUTES.DISPLAY_INGREDIENT} variant="body">
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={12}>
                                    <img class="image" src={checkingredients} alt="checkingredients"/>
                                </Grid>
                                <Grid item xs={12} align="center" spacing={3}>
                                    <Typography component="h6" variant="h6">Check Ingredient </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                </Grid>
		
            </Container>
        </div>
        );
}}

const IngredientManagement = withRouter(withFirebase(IngredientManagementBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (IngredientManagement);
