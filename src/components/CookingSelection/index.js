import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withAuthorization } from '../Session'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
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
    doc_id: '',
    time: '',
    pax: '',
    venue: '',
    temp_value:'',
    events: [],
    today:'',
    strEvents:''

};

class CookingSelectionBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.classes = { useStyles }
    }

    onSubmit = event => {
        event.preventDefault();       

        this.props.firebase.fs.collection("Catering_orders").where("venue", "==", this.state.doc_id).get().then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.id)
            this.props.history.push({
              pathname: './cooking-form',
              doc_id: doc.id          
            })
          })
        })
      }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value 
        });
        // console.log(this.state.doc_id)
    };

    componentDidMount() {  
        this.props.firebase.fs.collection('Customers').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                let orderidnum = Number(change.doc.data().orderNumber)
                this.setState({orderid: orderidnum+1,
                               orderiddoc: change.doc.id })
            })
        })
        let startDate = new Date()
        startDate.setHours(0)
        startDate.setMinutes(0)
        let endDate = new Date()
        endDate.setHours(23)
        endDate.setMinutes(0)
        this.props.firebase.fs.collection("Catering_orders").where("Date", ">=", startDate).where("Date", "<=", endDate).get().then(snapshot => {
          snapshot.forEach(doc => {                      
         
          if (this.state.strEvents.length == 0) {
            this.setState({
              strEvents: doc.data().venue
            }) 
          } else {
            this.setState({
              strEvents: this.state.strEvents + "," + doc.data().venue 
            })
          }
        });
      });
    }

    render() {
      {this.state.events = this.state.strEvents.split(",")} 
        
      return(
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        
      <div>
      <FormControl component="fieldset" id="cafe-list" className={this.classes.formControl}>
        <FormLabel component="legend"><h2>Catering Events For The Day</h2></FormLabel>
        <RadioGroup aria-label="doc_id" name="doc_id" id="cafe-list" value={this.value} onChange={this.handleChange}>
        {this.state.events.map((event, index) =>
          <FormControlLabel value={event} control={<Radio />} label={event} />
          )}
          <br></br>
        </RadioGroup>
      </FormControl>
      
      
      <form onSubmit={this.onSubmit}>
      
      <Button 
        type="submit"
        fullWidth
        // disabled={isInvalid} 
        variant="contained"
        color="primary"
        className={this.classes.submit}>
          Submit
        </Button>
      
      </form>
    </div>
    </Container>

        );
}}

const CookingSelection = withRouter(withFirebase(CookingSelectionBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition) (CookingSelection);