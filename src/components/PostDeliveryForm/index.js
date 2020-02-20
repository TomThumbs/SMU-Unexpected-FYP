import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session'

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

class PostDeliveryFormBase extends Component {


  render() {
    console.log(this.props.location)
      return(
  <div>
    <h1>Declaration for Order #{this.props.location.orderid} Successful.</h1>
    <h1>Driver: {this.props.location.driver}</h1>
    <img src={this.props.location.url}></img>
  </div>
);
}}

const PostDeliveryForm = withRouter(withFirebase(PostDeliveryFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (PostDeliveryForm);