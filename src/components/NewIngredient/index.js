import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import 'date-fns'; //npm i date-fns

// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; //npm i @material-ui/pickers
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
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
    console.log(urlId)
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
    this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodId).set({ 
      Expiry_Date: this.state.selectedDate, Name: this.state.name
    })
    event.preventDefault();
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

          {/* Food ID */}
          {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="foodId"
            value={this.state.foodId}
            label="Food ID"
            onChange={this.onChange}
            type="text"
            placeholder="Food ID"
            InputProps={{
              readOnly: true,
            }}
          /> */}
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
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
          </MuiPickersUtilsProvider> */}


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
