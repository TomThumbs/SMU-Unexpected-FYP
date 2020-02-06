import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

import 'date-fns'; //npm i date-fns
import DateFnsUtils from '@date-io/date-fns'; //npm i @date-io/date-fns@1.x date-fns

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; //npm i @material-ui/pickers
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
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
  foodType:'',
  inputLabel: '',
  RFID:'',
  temp_tag:'',
  foodName:'',
  storageDate:'',
  expiryDate:'',
  open:'',
  foodId:''
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
    if (this.state.storageDate.length == 0) {
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

  render(){
    const isInvalid = this.state.storageDate == this.state.expiryDate || this.state.foodName.length == 0;
    return(
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <div className={this.classes.paper}>
        <form onSubmit={this.onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="foodId"
            value={this.state.foodId}
            label="FoodID"
            onChange={this.onChange}
            type="text"
            placeholder="Food ID"
            autoFocus
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="foodName"
            value={this.state.foodName}
            label="foodName"
            onChange={this.onChange}
            type="text"
            placeholder="Food Name"
            autoFocus
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="storageDate"
            value={this.state.storageDate}
            label="storageDate"
            onChange={this.onChange}
            type="text"
            placeholder="Date of Storage"
            autoFocus
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="expiryDate"
            value={this.state.expiryDate}
            label="expiryDate"
            onChange={this.onChange}
            type="text"
            placeholder="Date of Expiry"
            autoFocus
          />


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
