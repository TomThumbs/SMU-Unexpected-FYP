import React, { Component } from 'react';
import '../../App.css';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import 'date-fns'; //npm i date-fns

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  menu:'',
  menu_List:[],
  chosen_menu:'',
  ingredientOne:'',
  ingredientTwo:'',
  ingredientThree:'',
  ingredientFour:'',
  ingredientFive:'',
  ingredientSix:'',
  ingredientSeven:'',
  ingredientEight:'',
  ingredientNine:'',
  ingredientTen:'',
  ingredientEleven:'',
  ingredientTwelve:'',
  ingredientThirteen:'',
  ingredientFourteen:'',
  ingredientFifteen:'',
  ingredientSixteen:'',
  ingredientSeventeen:'',
  ingredientEighteen:'',
  ingredientNineteen:'',
  ingredientTwenty:'',

};  

class DishToIngredientFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
  }

  classes = useStyles
  dishIngredients = []
  

  componentDidMount(){ 
    let tempMenu = ''
    this.props.firebase.fs.collection('Menu').get().then(snapshot=> {
      snapshot.forEach(doc => {
        console.log(doc.id)
        if (tempMenu == 0) {
          this.setState({
            menu: doc.id
          })
          tempMenu = this.state.menu
        } else {
          this.setState({
            menu: tempMenu + "," + doc.id
          })
          tempMenu = this.state.menu
        }
      })
    })
  }

  handleMenuChange = event => {
    this.setState({
      chosen_menu: event.target.value
    })
  }

  onSubmit = event => {
    event.preventDefault();
    if (this.state.ingredientOne.length != 0) {this.dishIngredients.push(this.state.ingredientOne)}
    if (this.state.ingredientTwo.length != 0) {this.dishIngredients.push(this.state.ingredientTwo)}
    if (this.state.ingredientThree.length != 0) {this.dishIngredients.push(this.state.ingredientThree)}
    if (this.state.ingredientFour.length != 0) {this.dishIngredients.push(this.state.ingredientFour)}
    if (this.state.ingredientFive.length != 0) {this.dishIngredients.push(this.state.ingredientFive)}
    this.props.firebase.fs.collection('Menu').doc(this.state.chosen_menu).update({ 
      Ingredients: this.dishIngredients//some map
      //Ingredients: [
        // {comma separated ingredients},
        // {maybe can sub the whole [{}] with the dishIngredients list} 
      // ]
    })
    this.handleClickOpen()
  }

  handleIngredientName = name => event => {
    this.setState({...this.props, [name]: event.target.value});   
    // this.dishIngredients.push(event.target.value)
    // console.log(this.dishIngredients)
  }

  renderSubmit() {
    if (this.state.chosen_menu.length == 0) {
      return <h1>Please select a dish.</h1>
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
    {this.state.menu_List = this.state.menu.split(",")}
    return (  
    <div>

      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Digital Menu Recipe
        </Typography>
        

        <Grid container spacing={3}>
        <Grid item xs={12}>
        <FormControl className={this.classes.formControl}>
          <InputLabel id="demo-simple-select-label">Name:</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.chosen_menu}
            onChange={this.handleMenuChange}
          >
          {this.state.menu_List.map((event, index) =>
            <MenuItem value={event}>{event}</MenuItem>
          )}
          </Select>
        </FormControl>
        </Grid>
          <Grid item xs={12}>
            Ingredients:
            <TextField
              required
              id="name" 
              name="name"
              label="Ingredient :"
              autoComplete="name"
              value={this.state.value}
              onChange={this.handleIngredientName('ingredientOne')}
            />
          </Grid>
          <Grid item xs={12}>
            Ingredients:
            <TextField
              required
              id="name" 
              name="name"
              label="Ingredient :"
              autoComplete="name"
              value={this.state.value}
              onChange={this.handleIngredientName('ingredientTwo')}
            />
          </Grid>
          <Grid item xs={12}>
            Ingredients:
            <TextField
              required
              id="name" 
              name="name"
              label="Ingredient :"
              autoComplete="name"
              value={this.state.value}
              onChange={this.handleIngredientName('ingredientThree')}
            />
          </Grid>
        </Grid>
      </React.Fragment>
      {this.renderSubmit()}

      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Submission Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Ingredients for {this.state.chosen_menu} have been stored.
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

const DishToIngredientForm = withRouter(withFirebase(DishToIngredientFormBase));

export default DishToIngredientForm;
