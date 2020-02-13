import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import 'date-fns';


import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';

import { CssBaseline } from '@material-ui/core';

import 'date-fns'; 
import DateFnsUtils from '@date-io/date-fns'; 
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; 

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
  foodType: "",
  inputLabel: "",
  temp_tag: "",
  foodName: "",
  storageDate: "",
  expiryDate: "",
  open: "",
  foodId: "",
};  

class NewIngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles }
  }

  componentDidMount(){
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    let urlId = urlParams.get('id')
    // console.log(urlId)
    this.setState({
      foodId: urlId
    })
    if (this.state.storageDate.length === 0) {
      let temp_date = new Date();
      let dd = String(temp_date.getDate()).padStart(2, '0');
      let mm = String(temp_date.getMonth() + 1).padStart(2, '0'); 
      let yyyy = temp_date.getFullYear();
      let string = dd + '/' + mm + '/' + yyyy
    
      this.setState({
        storageDate: string,
      })
    }
  }

  onSubmit = event => {
    event.preventDefault();
    let strMonth = Number(new Date().getMonth())+1
    this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodId).set({ 
      Date_of_expiry: this.state.expiryDate, 
      Name: this.state.foodName,
      Date_of_Storage:this.state.storageDate,
    })

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createTextField = (name, temp, label, placeholder) =>{
    // const read = readonly === "true"
    return(
      <TextField
        variant="outlined"
        margin="normal"
        required
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

  render(){
    const isInvalid = this.state.storageDate === this.state.expiryDate || this.state.foodName.length === 0;
    return(
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={this.classes.paper}>
        <form onSubmit={this.onSubmit}>
  
          {this.createTextField("foodId", this.state.foodId, "Food ID", "Food ID")}


          {/* Food Name */}
          {this.createTextField("foodName", this.state.foodName, "Food Name", "Food Name")}
          
          {/* Storage Date */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="storageDate"
            value={this.state.storageDate}
            label="Date of Storage"
            onChange={this.onChange}
            type="text"
            placeholder="Date of Storage"
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Date of Expiry */}
          {/* {this.createTextField("expiryDate", this.state.expiryDate, "Date of Expiry", "Date of Expiry")} */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            Expiry Date: 
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              id="date-picker-inline"
              value={this.state.expiryDate}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>


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

const NewIngredient = withRouter(withFirebase(NewIngredientForm));

export default NewIngredient;
