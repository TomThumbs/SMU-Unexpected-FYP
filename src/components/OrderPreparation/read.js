import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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
  orderID: '',
  // statusList: ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete'],
  dateOnly: '',
  time: '',
  venue: '',
  pax: '',
  status: '',
  menu: []
};  

class OrderPreparationBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles };
  }

  componentDidMount(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let urlId = Number(urlParams.get('id'));
    console.log(urlId)
    this.setState({
      orderID: urlId
    });

    console.log("Retreving doc")
    this.props.firebase.fs.collection('Catering_orders').where("orderID", "==", urlId).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let data = doc.data();
        this.setState({
          dateOnly: data.DateOnly,
          time: data.Time,
          venue: data.venue,
          pax: Number(data.Pax),
          status: data.Status,
          menu: Array.from(new Set(data.Menu)),
        })
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }

  renderMenu(){
    let list = [];
    this.state.menu.forEach((item,id) => {
      list.push(
        <div key={id}>
          <Grid item xs={6}>
            <Typography >{item}</Typography>
          </Grid>
          <Grid item xs={6}>
            {/* <TextField  */}
          </Grid>
        </div>
      )
    })
    return list;
  }

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

  render(){
    return(
      <Container className={this.classes.root}>
        {this.renderBackButton()}
        <Paper className={this.classes.paper}>

          <Grid className='grid' item xs={12}>
            <Paper className={this.classes.paper}>
            Order Received
            </Paper>
          </Grid>

          <Grid container spacing={3}>

            <Grid item xs={12}>
              <Typography>Deliver to:</Typography>
              <Typography> {this.state.venue}</Typography>
              <Typography> {this.state.dateOnly}</Typography>
              <Typography> {this.state.time}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>Menu: ({this.state.pax} pax)</Typography>
              {this.renderMenu()}
            </Grid>

          </Grid>

        </Paper>
      </Container>
      
    )
  }
}

const OrderPreparation = withRouter(withFirebase(OrderPreparationBase));

export default OrderPreparation;