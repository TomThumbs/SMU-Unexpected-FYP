import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session'

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import * as ROUTES from '../../constants/routes';
import Button from '@material-ui/core/Button';

class PostDeliveryFormBase extends Component {


  render() {
    console.log(this.props.location)
      return(
  <div class="body">
    <Container component="main" maxWidth="xs">
    <h1>Declaration for Order #{this.props.location.orderid} Successful.</h1>
    <h1>Driver: {this.props.location.driver}</h1>
    <img src={this.props.location.url}></img>
    <br></br>
    <br></br>
    <Button href={ROUTES.LANDING} color="primary" fullWidth variant="contained">Home</Button>
    </Container>
  </div>

);
}}

const PostDeliveryForm = withRouter(withFirebase(PostDeliveryFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (PostDeliveryForm);