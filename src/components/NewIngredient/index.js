import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../Session'
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns'; 
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    this.props.firebase.fs.collection('Ingredients').doc(this.state.foodId).set({ 
      ingredientId: this.state.foodId,
      Date_of_expiry: this.state.expiryDate, 
      Name: this.state.foodName,
      Date_of_Storage:this.state.storageDate,
    })
    this.handleClickOpen()
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
    // window.location.reload(true); 

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDateChange = event => {
    this.setState({
      expiryDate: event
    })
    // console.log(this.state.date)
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
  today = new Date()
  
  render(){
    const isInvalid = this.state.storageDate === this.state.expiryDate || this.state.foodName.length === 0;
    return(
      <div class="body"> 
      <Container component="main" maxWidth="xs">
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

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            Expiry Date: 
            <KeyboardDatePicker
              minDate={this.today}
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

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Submission Notification"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              {this.state.foodName} has been tagged.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Noted
              </Button>
            </DialogActions>
          </Dialog>

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
      </div>
      
    )
  }
}

const NewIngredient = withRouter(withFirebase(NewIngredientForm));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (NewIngredient);
