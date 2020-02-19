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
        // const { data } = this.props.location
        return(
        <div class="body">
             <Container component="main" maxWidth="xs">
                <Typography component="h4" variant="h4">Order Summary</Typography>
                <Typography component="h5" variant="h7">Order No.</Typography>
                <Typography component="h5" variant="h7">#{this.props.location.orderid}</Typography>
                <Typography component="h5" variant="h7">{this.props.location.date}</Typography>
                {/* <h3>{this.props.location.starttime} - {this.props.location.starttime}</h3> */}
                <Typography component="h5" variant="h7">{this.props.location.venue}</Typography>/
                {/* <h3>{this.props.location.venue}</h3> */}
                <Typography component="h5" variant="h7">{this.props.location.pax} pax</Typography>>
                <h3>-------------</h3>
                {/* <h3>SGD$ _undefined</h3> */}
            </Container>
        </div>
        );
}}

const PostOrderForm = withRouter(withFirebase(PostOrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (PostOrderForm);