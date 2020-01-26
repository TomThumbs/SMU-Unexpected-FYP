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

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

const INITIAL_STATE = {
    doc_id: '',
    time: '',
    pax: '',
    venue: '',
    temp_value:'',
    list_test: [],
    today:''

};

class DeliverySelectionBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }
    //removable
    //problem cannot filter by date
    // today = new Date();
    // dd = String(today.getDate()).padStart(2, '0');
    // mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // yyyy = today.getFullYear();
    // today = mm + '/' + dd + '/' + yyyy;
    
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
            [event.target.name]: event.target.value //i think this is for the chart?
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
    }



    renderRadio() {  
        this.props.firebase.fs.collection("Catering_orders").where("Date",">=","2020-01-19").onSnapshot(snapshot => { //to me, this is the 60 threshold. 
            let changes = snapshot.docChanges();                           //if a new value is keyed in, update the value 
            changes.forEach(change => {                                     // both
                console.log(this.state.list_test);


            });
        });

    
      }

      renderList() {
        // <FormControlLabel value="Event" control={<Radio />} label="Event" />
        return (<div>"clear"{this.state.list_test.map(event => <FormControlLabel value={Event} control={<Radio />} label={Event} />)}</div>);
            //   <div>
            //       <ul>{this.state.list_test.map(event => <li key={event}>{event}</li>)}</ul>
            //   </div>
        //   )
      }

    render() {
 
        return(
        <div>


        <FormControl component="fieldset" className={this.classes.formControl}>
        <FormLabel component="legend">Catering events for the day</FormLabel>
        <RadioGroup aria-label="doc_id" name="doc_id" value={this.state} onChange={this.handleChange}>
          <FormControlLabel value="Event" control={<Radio />} label="Event" />
          <FormControlLabel value="Event 2" control={<Radio />} label="Event 2" />
          <FormControlLabel value="Event 3" control={<Radio />} label="Event 3" />
          <FormControlLabel value="Event 4" control={<Radio />} label="Event 4" />
          {this.renderList()}
        </RadioGroup>
      </FormControl>
      <form onSubmit={this.onSubmit}>
                      <button type='submit'>Submit</button>
                      </form>

        </div>
        );
}}

const DeliverySelection = withRouter(withFirebase(DeliverySelectionBase));

export default DeliverySelection;