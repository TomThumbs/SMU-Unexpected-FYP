import React, { Component } from 'react';

import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Checkbox from '@material-ui/core/Checkbox';


import { withAuthorization } from '../Session'

import 'date-fns'; 

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const INITIAL_STATE = {
  orderid: 0,
  date: '',
  starttime:'',
  endtime:'',
  venue: '',
  pax: 0,
  hour: '',
  minute:'',
  custname: '',
  custcontact: '',
  custemail: '',
  custcompany: '',
  custID:0,
  custref:'',
  selectedmenu:[],
  finalmenu:[],
  ingredientsUsed:[],
  ingredientTagsUsed:''
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

class CookingFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles }
  }


  componentDidMount() {  
//this.props.location.doc_id
    this.props.firebase.fs.collection('Catering_orders').doc(this.props.location.doc_id).get().then(doc=> {
      // console.log(doc.data())
          this.setState({
            orderid: doc.data().orderID,
            catering_event_doc: doc.id,
            date: String(doc.data().Date.toDate()).split("GMT")[0].split(" ")[1] + " " + String(doc.data().Date.toDate()).split("GMT")[0].split(" ")[2] + " "+ String(doc.data().Date.toDate()).split("GMT")[0].split(" ")[3],
            menu: doc.data().Menu,
            venue: doc.data().venue,
            pax: doc.data().Pax,
            ingredientTagsUsed: doc.data().Ingredient_Tags_Used
          }) 
          // console.log((doc.data().Date.toDate()).getMinutes())
          if (Number(doc.data().Date.toDate().getHours()) === 12) {
            this.setState({
              time: doc.data().Date.toDate().getHours() + ":" + doc.data().Date.toDate().getMinutes() + " PM"
              }
            )
          }  
          if (Number(doc.data().Date.toDate().getHours()) >= 12) {
            this.setState({
              time: (Number(doc.data().Date.toDate().getHours())-12) + ":" + doc.data().Date.toDate().getMinutes() + " PM"
              }
            )
          }
          if (Number(doc.data().Date.toDate().getHours()) < 12) {
            this.setState({
              time: doc.data().Date.toDate().getHours() + ":" + doc.data().Date.toDate().getMinutes() + " AM"
              }
            )
          }

        this.props.firebase.fs.collection('Customers').doc(doc.data().Customer.id).get().then(docu=>{
          this.setState({
            custname:docu.data().Name,
            custcompany:docu.data().Company,
            custemail:docu.data().Email
          })
        })  
      }) 

    // SHOW list of menu items selected. 
    this.props.firebase.fs.collection('Menu').orderBy("Type").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
          changes.forEach(change => {
            let dishname = change.doc.data().name
            let dishtype = change.doc.data().Type
            this.setState((prevstate) => ({
            selectedmenu:[...prevstate.selectedmenu,{dish:dishname, type:dishtype, selected:"false"}]
        }))
      })
    })
  }
  //my rationale for trying to detect the ingredient linked to the rfid, BUT NOT creating a reference object is cuz
  //these tags and codes should be reusable. So I will dig out the tags and add an additional field for reference
  onSubmit = event => {
    event.preventDefault();
    // console.log(this.state.ingredientTagsUsed)
    let ingredientsTempList = this.state.ingredientTagsUsed.split(",")
    let ingredientsTempListLength = ingredientsTempList.length  
    for (var i = 0; i < ingredientsTempListLength; i++) {
      this.props.firebase.fs.collection('Ingredient_RFID').doc(ingredientsTempList[i]).get().then(doc=>{
        this.setState((prevstate) => ({
          ingredientsUsed: [...prevstate.ingredientsUsed, doc.data().Name + ": " + doc.data().Date_of_expiry]
        }));
        this.props.firebase.fs.collection('Catering_orders').doc(this.props.location.doc_id).update({
          Ingredients_Used: this.state.ingredientsUsed
        })
      })
    }
  
    this.props.firebase.fs.collection('Catering_orders').doc(this.props.location.doc_id).update({
      Ingredient_Tags_Used: this.state.ingredientTagsUsed,
        })
    this.handleClickOpen()
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
    this.props.history.push({
      pathname: './cooking-selection',
    })
  };

  onChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value 
    });
  }

  onMenuChange = event => {
    const dishname = event.target.value;

    this.setState((prevstate) => ({
      finalmenu: [...prevstate.finalmenu, dishname]
    }));
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
        InputProps={{
          readOnly: true,
        }}
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
              onChange={this.onMenuChange} 
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
    // let isInvalid = this.state.ingredientTagsUsed.length === 0

    return(
      <Container component="main" maxWidth="sm">
        <div className={this.classes.root}>
          <Typography variant="h6" align="center" gutterBottom>
          Order Preparation
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
            {/* Delivery Date */}
            {this.createTextField("date", this.state.date, "Delivery Date and Time:", "date")}
            
            {/* Delivery Time */}
            {this.createTextField("time", this.state.time, "", "Time")}

            {/* Deliver Pax */}
            {this.createTextField("pax", this.state.pax, "Pax:", "pax")}

            {/* Customer Name */}
            {this.createTextField("custname", this.state.custname, "Customer Name:", "Customer Name")}

            {/* Customer Email */}
            {this.createTextField("custemail", this.state.custemail, "Customer Email:", "Customer Email")}

            {/* Customer Company */}
            {this.createTextField("custcompany", this.state.custcompany, "Customer Company:", "Customer Company")}
            
            {/* Postal Code */}
            {this.createTextField("venue", this.state.venue, "Postal Code:", "Postal Code")}

            {/* Display Menu */}
            {/* {this.renderMenu()} */}

            Ingredients Used:    
            <TextField
              margin="normal"
              id="standard-number"
              fullWidth
              name="ingredientTagsUsed"
              value={this.state.ingredientTagsUsed}
              label="Scan tags here"
              type="string"
              onChange={this.onChange}
              InputLabelProps={{
                shrink: true,
              }}
            />


            <Button 
              // disabled={isInvalid} 
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}>
              Submit
            </Button>
          </form>

          <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Submission Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Ingredients have been tagged.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Noted
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      </Container>
    )
  }
}

const CookingForm = withRouter(withFirebase(CookingFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (CookingForm);

