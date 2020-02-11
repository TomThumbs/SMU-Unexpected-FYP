import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import Paper from '@material-ui/core/Paper';
// import { CssBaseline } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const INITIAL_STATE = {
  orderID: '',
  statusList: ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete']
};  

class OrderReceivedBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles };
  }

  componentDidMount(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let urlId = urlParams.get('id');
    console.log(urlId)
    this.setState({
      orderID: Number(urlId)
    });

    this.props.firebase.fs.collection('Catering_orders').where("orderID", "==", Number(urlId)).get()
    .then(querySnapshot => {
      // console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        console.log(doc.data());
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
  }

  render(){
    return(
      <Container component="main" maxWidth="xs">
        <p>Hi</p>
      </Container>
    )
  }
}

const OrderReceived = withRouter(withFirebase(OrderReceivedBase));

export default OrderReceived;