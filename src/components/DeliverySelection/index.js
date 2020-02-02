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

// const cafeList = document.querySelector('#cafe-list');
// const form = document.querySelector('#add-cafe-form')

// // create element and render cafe
// function renderCafe(doc) {
//     let li = document.createElement('li');
//     let name = document.createElement('span');
//     let city = document.createElement('span');
//     let cross = document.createElement('div');

//     li.setAttribute('data-id', doc.id);
//     name.textContent = doc.data().name
//     city.textContent = doc.data().city
//     cross.textContent = 'x';

//     li.appendChild(name);
//     li.appendChild(city);
//     li.appendChild(cross)

//     cafeList.appendChild(li);

//     // deleting data
//     cross.addEventListener('click', (e) => {
//         e.stopPropagation();
//         let id = e.target.parentElement.getAttribute('data-id');
//         db.collection('cafes').doc(id).delete();
//     })
// }

// db.collection('cafes').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     })
// })

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

class DeliverySelectionBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    
    classes = useStyles;

    onSubmit = event => {
        event.preventDefault();       
        this.props.history.push({
          pathname: './delivery-form',
          doc_id: this.state.doc_id          
        })
      }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value 
        });
        console.log(this.state.doc_id)
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
        this.props.firebase.fs.collection("Catering_orders").onSnapshot(snapshot => {
              let changes = snapshot.docChanges();                       
              changes.forEach(change => {
                if (this.state.strEvents.length == 0) {
                  this.setState({
                    strEvents: change.doc.id
                  }) 
                } else {
                this.setState({
                  strEvents: this.state.strEvents + "," + change.doc.id 
                })
                // console.log(this.state.strEvents)
              }
                    // this.state.list_test.push(change.doc.id)  
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

const DeliverySelection = withRouter(withFirebase(DeliverySelectionBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition) (DeliverySelection);