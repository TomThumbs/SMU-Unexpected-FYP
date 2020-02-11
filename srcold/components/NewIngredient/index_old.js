import React, { Component } from 'react';
import '../../App.css';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const INITIAL_STATE = {
  today:'',
  selectedDate:'',
  foodType:'',
  inputLabel: '',
  RFID:'',
  temp_tag:'',
  name:'',
  open:'',
  foodId:''
};  

class RFIDTagInputFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
  }

  classes = useStyles

  componentDidMount(){
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    let urlId = urlParams.get('id')
    console.log(urlId)
    this.setState({
      foodId: urlId
    })
  }

  handleTagChange = event => {
    this.setState({
      foodType: event.target.value
    })
  }

  handleRFID = data => {
    if (this.state.foodType.length != 0 && (this.state.foodType != this.state.temp_tag)) {
      this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodType).get().then(doc=> {
        let increRFID = Number(doc.data().RFID)+1
        this.setState({
          RFID: increRFID,
          temp_tag: this.state.foodType
        }) 
      })
    }
  }

  handleDateChange = date => {
    let temp_date = String(date).slice(0,15)
    this.setState({
      selectedDate: temp_date
    })
    console.log(temp_date)
    console.log(this.state.selecteddDate)
  };  

  onSubmit = event => {
    event.preventDefault();

    // this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodType).update({
    //   RFID: this.state.RFID
    // })

    // this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodType).collection(strRFID).doc("Document Details").set({ 
    //   Expiry_Date: this.state.selectedDate, Name: this.state.name
    // })
    // let strRFID = String(this.state.RFID)
    this.props.firebase.fs.collection('Ingredient_RFID').doc(this.state.foodId).set({ 
      Expiry_Date: this.state.selectedDate, Name: this.state.name
    })
    this.handleClickOpen()
  }

  today() {
    if (this.state.today.length == 0) {
      let temp_date = new Date();
      let dd = String(temp_date.getDate()).padStart(2, '0');
      let mm = String(temp_date.getMonth() + 1).padStart(2, '0'); 
      let yyyy = temp_date.getFullYear();
      let string = dd + '/' + mm + '/' + yyyy
    
      this.setState({
        today: string,
        selectedDate: string
      })
    }
  }

  handleIngredientName = name => event => {
    this.setState({...this.props, [name]: event.target.value});   
  }

  renderSubmit() {
    // if (this.state.today == this.state.selectedDate || this.state.foodType.length == 0 || this.state.name.length == 0) {
    //   return <h1>Please select a tag, input ingredient name and choose a future expiry date</h1>
    //       // <form onSubmit={this.onSubmit}>
    //       //    <button type='submit'>Submit</button>
    //       //    </form>
    // } else {
    //   return <form onSubmit={this.onSubmit}>
    //          <button type='submit'>Submit</button>
    //          </form>
    // }
    if (this.state.today == this.state.selectedDate || this.state.name.length == 0) {
      return <h1>Please select a tag, input ingredient name and choose a future expiry date</h1>
          // <form onSubmit={this.onSubmit}>
          //    <button type='submit'>Submit</button>
          //    </form>
    } else {
      return <form onSubmit={this.onSubmit}>
              <button type='submit'>Submit</button>
             </form>
    }
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
    window.location.reload(true);
  };

  render() {
    // {this.testurl()}

    const isInvalid = this.state.today == this.state.selectedDate || this.state.name.length == 0;

    return (  
    <div>

      <React.Fragment>
        <Typography align="center" variant="h6" gutterBottom>
          Barcode Tag Registration
        </Typography>
        

        <Grid container justify="center" spacing={3} alignItems="center">
          <Grid item xs={3}>
          Item ID: 
          </Grid>
          <Grid item xs={3}>
          <Paper>{this.state.foodId}</Paper>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
        <FormControl className={this.classes.formControl}>
          <InputLabel id="demo-simple-select-label">Tag</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.foodType}
            onChange={this.handleTagChange}
          >
            <MenuItem value="A">A (Vegetables)</MenuItem>
            <MenuItem value="B">B (Fish)</MenuItem>
            <MenuItem value="C">C (Meat)</MenuItem>
            <MenuItem value="D">D</MenuItem>
            <MenuItem value="E">E</MenuItem>
            <MenuItem value="F">F</MenuItem>
          </Select>
        </FormControl> */}
        {/* {this.handleRFID()}{this.state.RFID} */}
        {/* </Grid> */}
        <Grid container justify="center" spacing={3} alignItems="center">
          <Grid item xs={3}>Name:</Grid>
          <Grid item xs={3}>
            <TextField
              required
              id="name" 
              name="name"
              label="Name of ingredient:"
              autoComplete="name"
              value={this.state.value}
              onChange={this.handleIngredientName('name')}
            />
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={3} alignItems="center">
          <Grid item xs={3}>Date of entry:</Grid>
          <Grid item xs={3}>
            {this.today()} {this.state.today}
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={3} alignItems="center">
          <Grid item xs={3}>Date of Expiry: </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3}> {/* container justify="space-around"> */}
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              value={this.state.selectedDate}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid container justify="center" spacing={3} alignItems="center">
          {this.renderSubmit()}
        </Grid>
      </React.Fragment>

      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Submission Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tag has been submitted to database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Noted
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
  }
}

const RFIDTagInputForm = withRouter(withFirebase(RFIDTagInputFormBase));

export default RFIDTagInputForm;
