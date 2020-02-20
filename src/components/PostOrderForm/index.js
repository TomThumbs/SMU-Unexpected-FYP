import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session'

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';


class PostOrderFormBase extends Component {


    render() {

        return(
        <div class="body">
             <Container component="main" maxWidth="xs">
                <Typography component="h4" variant="h4">Order Summary</Typography>
                <Typography component="h5" variant="h7">Order No.</Typography>
                <Typography component="h5" variant="h7">#{this.props.location.orderid}</Typography>
                <Typography component="h5" variant="h7">Date: {this.props.location.date.split(' ')[1]}/{this.props.location.date.split(' ')[2]}/{this.props.location.date.split(' ')[3]}</Typography>
                <Typography component="h5" variant="h7">Time: {this.props.location.date.split(' ')[4]}</Typography>
                <Typography component="h5" variant="h7"> Venue Postal Code: {this.props.location.venue}</Typography>

                <Typography component="h5" variant="h7">{this.props.location.pax} pax</Typography>
            </Container>
        </div>
        );
}}

const PostOrderForm = withRouter(withFirebase(PostOrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (PostOrderForm);