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
                        <Link component={RouterLink} to={ROUTES.NEW_INGREDIENT} variant="body">
                            <Grid container justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <img class="image" src={tagnew} alt="logo"/>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Typography component="h5" variant="h5">Tag New Ingredient</Typography>
                                </Grid>
                            </Grid>
                        </Link>
                    </Grid>
                    
                    <Grid container item xs >
                        <Link component={RouterLink} to={ROUTES.ORDER_PREPARATION_EDIT} variant="body">
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={12}>
                                    <img class="image" src={tagtoorder} alt="tagtoorder"/>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Typography component="h5" variant="h5">Tag Ingredients To Order</Typography>
                                </Grid>
                            </Grid>
                        </Link>
                    </Grid>

                    <Grid container item xs >
                        <Link component={RouterLink} to={ROUTES.DISPLAY_INGREDIENT} variant="body">
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={12}>
                                    <img class="image" src={checkingredients} alt="checkingredients"/>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Typography component="h5" variant="h5">Check Ingredient </Typography>
                                </Grid>
                            </Grid>
                        </Link>
                    </Grid>
                </Grid>
		
            </Container>
        </div>
        );
}}

const IngredientManagement = withRouter(withFirebase(IngredientManagementBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (IngredientManagement);
