import React, { Component } from 'react';
import '../../App.css';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import 'date-fns'; 

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
    this.props.firebase.fs.collection('Menu').get().then(snapshot=> {
      snapshot.forEach(doc => {
        
        this.setState((prevstate) => ({
          menu_List: [...prevstate.menu_List, doc.id]
        }));
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
    if (this.state.ingredientOne.length !== 0) {this.dishIngredients.push(this.state.ingredientOne)}
    if (this.state.ingredientTwo.length !== 0) {this.dishIngredients.push(this.state.ingredientTwo)}
    if (this.state.ingredientThree.length !== 0) {this.dishIngredients.push(this.state.ingredientThree)}
    if (this.state.ingredientFour.length !== 0) {this.dishIngredients.push(this.state.ingredientFour)}
    if (this.state.ingredientFive.length !== 0) {this.dishIngredients.push(this.state.ingredientFive)}
    if (this.state.ingredientSix.length !== 0) {this.dishIngredients.push(this.state.ingredientSix)}
    if (this.state.ingredientSeven.length !== 0) {this.dishIngredients.push(this.state.ingredientSeven)}
    if (this.state.ingredientEight.length !== 0) {this.dishIngredients.push(this.state.ingredientEight)}
    if (this.state.ingredientNine.length !== 0) {this.dishIngredients.push(this.state.ingredientNine)}
    if (this.state.ingredientTen.length !== 0) {this.dishIngredients.push(this.state.ingredientTen)}
    if (this.state.ingredientEleven.length !== 0) {this.dishIngredients.push(this.state.ingredientEleven)}
    if (this.state.ingredientTwelve.length !== 0) {this.dishIngredients.push(this.state.ingredientTwelve)}
    if (this.state.ingredientThirteen.length !== 0) {this.dishIngredients.push(this.state.ingredientThirteen)}
    if (this.state.ingredientFourteen.length !== 0) {this.dishIngredients.push(this.state.ingredientFourteen)}
    if (this.state.ingredientFifteen.length !== 0) {this.dishIngredients.push(this.state.ingredientFifteen)}
    if (this.state.ingredientSixteen.length !== 0) {this.dishIngredients.push(this.state.ingredientSixteen)}
    if (this.state.ingredientSeventeen.length !== 0) {this.dishIngredients.push(this.state.ingredientSeventeen)}
    if (this.state.ingredientEighteen.length !== 0) {this.dishIngredients.push(this.state.ingredientEighteen)}
    if (this.state.ingredientNineteen.length !== 0) {this.dishIngredients.push(this.state.ingredientNineteen)}
    if (this.state.ingredientTwenty.length !== 0) {this.dishIngredients.push(this.state.ingredientTwenty)}
    
    this.props.firebase.fs.collection('Menu').doc(this.state.chosen_menu).update({ 
      Ingredients: this.dishIngredients
    })
    this.handleClickOpen()
  }

  onChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value 
    });
    
  }

  renderSubmit() {
    if (this.state.chosen_menu.length === 0) {
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

  createTextField = (name, temp, label, placeholder) =>{
    return(
      <Grid item spacing xs={12}>
      <TextField
        margin="normal"
        // fullWidth
        name={name}
        value={temp}
        label={label}
        onChange={this.onChange}
        type="text"
        placeholder={placeholder}
      />
      </Grid>
    )
  }

  render() {
    
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

        Ingredients
        {this.createTextField("ingredientOne", this.state.ingredientOne, "Ingredient 1:", "Ingredient")}
        {this.createTextField("ingredientTwo", this.state.ingredientTwo, "Ingredient 2:", "Ingredient")}
        {this.createTextField("ingredientThree", this.state.ingredientThree, "Ingredient 3:", "Ingredient")}
        {this.createTextField("ingredientFour", this.state.ingredientFour, "Ingredient 4:", "Ingredient")}
        {this.createTextField("ingredientFive", this.state.ingredientFive, "Ingredient 5:", "Ingredient")}
        {this.createTextField("ingredientSix", this.state.ingredientSix, "Ingredient 6:", "Ingredient")}
        {this.createTextField("ingredientSeven", this.state.ingredientSeven, "Ingredient 7:", "Ingredient")}
        {this.createTextField("ingredientEight", this.state.ingredientEight, "Ingredient 8:", "Ingredient")}
        {this.createTextField("ingredientNine", this.state.ingredientNine, "Ingredient 9:", "Ingredient")}
        {this.createTextField("ingredientTen", this.state.ingredientTen, "Ingredient 10:", "Ingredient")}
        {this.createTextField("ingredientEleven", this.state.ingredientEleven, "Ingredient 11:", "Ingredient")}
        {this.createTextField("ingredientTwelve", this.state.ingredientTwelve, "Ingredient 12:", "Ingredient")}
        {this.createTextField("ingredientThirteen", this.state.ingredientThirteen, "Ingredient 13:", "Ingredient")}
        {this.createTextField("ingredientFourteen", this.state.ingredientFourteen, "Ingredient 14:", "Ingredient")}
        {this.createTextField("ingredientFifteen", this.state.ingredientFifteen, "Ingredient 15:", "Ingredient")}
        {this.createTextField("ingredientSixteen", this.state.ingredientSixteen, "Ingredient 16:", "Ingredient")}
        {this.createTextField("ingredientSeventeen", this.state.ingredientSeventeen, "Ingredient 17:", "Ingredient")}
        {this.createTextField("ingredientEighteen", this.state.ingredientEighteen, "Ingredient 18:", "Ingredient")}
        {this.createTextField("ingredientNineteen", this.state.ingredientNineteen, "Ingredient 19:", "Ingredient")}
        {this.createTextField("ingredientTwenty", this.state.ingredientTwenty, "Ingredient 20:", "Ingredient")}


         
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
