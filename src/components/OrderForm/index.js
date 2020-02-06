import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { withAuthorization } from '../Session'

import 'date-fns'; //npm i date-fns
import DateFnsUtils from '@date-io/date-fns'; //npm i @date-io/date-fns@1.x date-fns
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; //npm i @material-ui/pickers
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
  selectedmenu:[],
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
    this.props.firebase.fs.collection('Menu').orderBy("Type").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        // console.log(change.doc.data())
        let dishname = change.doc.data().name
        let dishtype = change.doc.data().Type
        this.setState((prevstate) => ({
        selectedmenu:[...prevstate.selectedmenu,{dish:dishname, type:dishtype, selected:"false"}]
    }))
      })
    })
  }

  onSubmit = event => {
    console.log(this.state)
    event.preventDefault();
  }

  onChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value 
    });
    // console.log(event.target.name + ": " + event.target.value)
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

  renderMenu = () => {
    let listofmenu = [];
    let dishtype = []

    this.state.selectedmenu.forEach(item => {

      if(dishtype.includes(item.type) === false){
        dishtype.push(item.type);
        listofmenu.push(<p key={item.type}>{item.type}</p>);
      }

      listofmenu.push(
        <div key={item.dish}>
          <FormControlLabel 
            control={
            <Checkbox 
              // checked={item.selected} 
              onChange={this.onChange} 
              name={item.dish} 
              value={item.dish} 
              color="primary" 
            />} 
          label={item.dish} 
          />
          <br/>
        </div>
      )
    })
    
    return listofmenu;
  }

  render () {
    let isInvalid = this.state.date.length !== 0 &&
    this.state.starttime.length !== 0 &&
    this.state.venue.length !== 0 &&
    this.state.pax.length !== 0 &&
    this.state.custname.length !== 0 &&
    this.state.custcontact.length !== 0 &&
    this.state.custemail.length !== 0 &&
    this.state.custcompany.length !== 0 

    return(
      <Container component="main" maxWidth="sm">
        <div className={this.classes.root}>
          <Typography variant="h6" align="center" gutterBottom>
          Order Creation
          </Typography>
          
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="filled"
              margin="dense"
              fullWidth
              name="orderid"
              value={this.state.orderid}
              label="Order ID"
              placeholder="Order ID"
              autoFocus
              InputProps={{
                readOnly: true,
              }}
            />
            <div><br></br></div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              Date: 
              <KeyboardDatePicker
                variant="inline"
                format="dd/MM/yyyy"
            
                id="date-picker-inline"
                value={this.state.date}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              Time: 
              <KeyboardTimePicker
                margin="none"
                id="time-picker"
                value={this.state.starttime}
                onChange={this.handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>

            <TextField
              margin="normal"
              id="standard-number"
              fullWidth
              name="pax"
              value={this.state.pax}
              label="Number of people"
              type="number"
              onChange={this.onChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps= {{ min: 10}}
            />

            {/* Customer Name */}
            {this.createTextField("custname", this.state.custname, "Customer Name:", "Customer Name")}

            {/* Customer Email */}
            {this.createTextField("custemail", this.state.custemail, "Customer Email:", "Customer Email")}

            {/* Customer Company */}
            {this.createTextField("custcompany", this.state.custcompany, "Customer Company:", "Customer Company")}
            
            {/* Postal Code */}
            {this.createTextField("venue", this.state.venue, "Postal Code:", "Postal Code")}

            {/* Display Menu */}
            {this.renderMenu()}

            <Button 
              disabled={isInvalid} 
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}>
              Submit
            </Button>
          </form>
        </div>
      </Container>
    )
  }
}

const OrderForm = withRouter(withFirebase(OrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (OrderForm);

