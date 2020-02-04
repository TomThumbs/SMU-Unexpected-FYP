import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

class PostOrderFormBase extends Component {


    render() {
        // const { data } = this.props.location
        return(
        <div>
            <h1>Order Summary</h1>
            <h6>Order No.</h6>
            <h3>#{this.props.location.orderid}</h3>
            <h3>{this.props.location.date}</h3>
            {/* <h3>{this.props.location.starttime} - {this.props.location.starttime}</h3> */}
            <h3>{this.props.location.venue}</h3>/
            {/* <h3>{this.props.location.venue}</h3> */}
            <h3>{this.props.location.pax} pax</h3>
            <h3>-------------</h3>
            {/* <h3>SGD$ _undefined</h3> */}
        </div>
        );
}}

const PostOrderForm = withRouter(withFirebase(PostOrderFormBase));

export default PostOrderForm;