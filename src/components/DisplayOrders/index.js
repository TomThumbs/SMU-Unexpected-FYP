import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import Paper from '@material-ui/core/Paper';
import { CssBaseline } from '@material-ui/core';

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

const INITIAL_STATE ={
  orderList: [],
}

class DisplayOrdersBase extends Component{
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles }
  }

  componentDidMount(){
    this.props.firebase.fs.collection('Catering_orders').orderBy("orderID", "desc").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        let orderID = change.doc.data().orderId;
        let date = change.doc.data().DateOnly;
        let time = change.doc.data().Time;
        let pax = change.doc.data().Pax;
        let venue = change.doc.data().venue;

        this.setState((prevstate) => ({
          orderList: [...prevstate.orderList, {
            orderID: orderID, 
            date:date, 
            time:time, 
            pax:pax, 
            venue:venue
          }]
        }))
      })
    })
  }

  renderOrder(){

  }

  render(){
    return(
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Grid container justify="center" spacing={3} alignItems="center">

        </Grid>
      </Container>
    )
  }
}

const DisplayOrders = withRouter(withFirebase(DisplayOrdersBase));

export default DisplayOrders;