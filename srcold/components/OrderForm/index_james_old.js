import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

import 'date-fns'; //npm i date-fns
import DateFnsUtils from '@date-io/date-fns'; //npm i @date-io/date-fns@1.x date-fns
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; //npm i @material-ui/pickers

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { CssBaseline } from '@material-ui/core';

const INITIAL_STATE = {
  orderid: 0,
  orderiddoc: '',
  date: '',
  starttime:'',
  endtime:'',
  venue: '',
  pax: 0,
  custname: '',
  custcontact: '',
  custemail: '',
  custcompany: '',
  custID:0,
  custref:'',
  bva: false,
  bvb: false,
  rca: false,
  rcb: false,
  dea: false,
  deb: false,
  fia: false,
  fib: false,
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


class OrderFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles }
  }
  
  componentDidMount() {  
    // Detect latest order ID
    this.props.firebase.fs.collection('Order_ID').orderBy("orderNumber", "desc").limit(1).onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        let orderidnum = Number(change.doc.data().orderNumber)
        this.setState({
          orderid: orderidnum+1, 
          orderiddoc: change.doc.id
        })
      })
    })

    // Get list of menu items
    this.props.firebase.fs.collection('Menu')
  }

  onSubmit = event => {
    
  }

  onChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value 
    });
    console.log(event.target.name + ": " + event.target.value)
  }

  handleDateChange = event => {
    this.setState({
      date: event
    })
  };

  handleTimeChange = time => {
    this.setState({
      starttime: time
    }) 
  }

  createTextField = (name, temp, label, placeholder) =>{
    return(
      <TextField
        margin="normal"
        fullWidth
        name={name}
        value={temp}
        label={label}
        onChange={this.onChange}
        type="text"
        placeholder={placeholder}
      />
    )
  }


  render () {
    let isInvalid = this.state.date.length !== 0 &&
    this.state.starttime.length !== 0 &&
    this.state.venue.length !== 0 &&
    this.state.pax.length !== 0 &&
    this.state.name.length !== 0 &&
    this.state.contact.length !== 0 &&
    this.state.email.length !== 0 &&
    this.state.company.length !== 0 

    return(
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={this.classes.paper}>
          <Typography variant="h6" align="center" gutterBottom>
          Order Creation
          </Typography>
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="filled"
              margin="normal"
              fullWidth
              name="orderid"
              value={this.state.orderid}
              label="orderid"
              placeholder="Order ID"
              autoFocus
              InputProps={{
                readOnly: true,
              }}
            />
            <p>Order Date</p>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                value={this.state.date}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                value={this.state.starttime}
                onChange={this.handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>

            {/* Postal Code */}
            {this.createTextField("venue", this.state.venue, "Postal Code:", "Postal Code")}

            {/* Number of people */}
            {this.createTextField("pax", this.state.pax, "Number of people:", "Pax")}

            {/* Customer Name */}
            {this.createTextField("custname", this.state.custname, "Customer Name:", "Customer Name")}

            {/* Customer Email */}
            {this.createTextField("custemail", this.state.custemail, "Customer Email:", "Customer Email")}

            {/* Customer Company */}
            {this.createTextField("custcompany", this.state.custcompany, "Customer Company:", "Customer Company")}

            <Button 
              disabled={isInvalid} 
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    )
  }
}

const OrderForm = withRouter(withFirebase(OrderFormBase));

export default OrderForm;
