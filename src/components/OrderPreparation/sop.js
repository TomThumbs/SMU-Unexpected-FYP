import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    maxWidth:400,
    textAlign: 'center',
    // margin: `${theme.spacing(1)}px auto`,
    // padding: theme.spacing(2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  text:{
    textAlign: 'center',
  }
}));

const INITIAL_STATE = {
  docID:'',
  orderID: '',
};  

class OrderPreparationSopBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, docID: props.location.state.docID};
    this.classes = { useStyles };
  }

  componentDidMount(){}

  renderBackButton(){
    return(
      <Link
        to={{
        pathname: ROUTES.ORDER_TIMELINE,
        search: '?id=' + this.state.orderID
      }}>
        <Button>Back</Button>
      </Link>
    )
  }

  onSubmit = event => {}

  onChange = event => {}

  render(){
    return(
      <Container className={this.classes.root}>
        {this.renderBackButton()}
        <Paper className={this.classes.paper}>
          <Typography>Order Preparation SOP Agreement</Typography>
          <Typography>Order #{this.state.orderID}</Typography>

          {/* ---------- FORM ---------- */}
          <form onSubmit={this.onSubmit}>
            
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={this.classes.submit}
            >Submit</Button>
          </form>
        </Paper>
      </Container>
    )
  }
}

const OrderPreparationSop = withRouter(withFirebase(OrderPreparationSopBase));

export default OrderPreparationSop;