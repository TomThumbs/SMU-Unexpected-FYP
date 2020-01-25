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
  list_test: [],
  today:''
};

const DeliverySelectionPage = () => (
  <div >
    <br></br><br></br>
    <DeliverySelection />
  </div>
);

class DeliverySelectionBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
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
        [event.target.name]: event.target.value //i think this is for the chart?
    });
    console.log(this.state.doc_id)
};

  // componentDidMount() {  
    // this.props.firebase.fs.collection('Customers').onSnapshot(snapshot => {
    //     let changes = snapshot.docChanges();
    //     changes.forEach(change => {
    //         let orderidnum = Number(change.doc.data().orderNumber)
    //         this.setState({orderid: orderidnum+1,
    //                        orderiddoc: change.doc.id })
    //         // console.log(this.state.orderid)
    //       })
    // })

  renderRadio() {  
    this.props.firebase.fs.collection("Catering_orders").where("Date",">=","2020-01-19").onSnapshot(snapshot => { //to me, this is the 60 threshold. 
        let changes = snapshot.docChanges();                           //if a new value is keyed in, update the value 
        changes.forEach(change => {                                     // both
            console.log(this.state.list_test);
            // this.state.list_test.push(change.doc.id); //use concat. then must log it. then can try returning. 
            // event time pax venue
            // let temp_value = doc.id
            return 
            // <FormControlLabel value= {change.doc.id} control={<Radio />} label= {change.doc.id} />
            //problem rendering radio button 
        });
    });
    // for (var i = 0; i < this.state.list_test.length; i ++ ){
    //     console.log(this.state.list_test[i]);
    //  }

  }

  renderList() {
    // <FormControlLabel value="Event" control={<Radio />} label="Event" />
    return (<div>{this.state.list_test.map(event => <FormControlLabel value={Event} control={<Radio />} label={Event} />)}</div>);
        //   <div>
        //       <ul>{this.state.list_test.map(event => <li key={event}>{event}</li>)}</ul>
        //   </div>
    //   )
  }

render() {

    return(

      <Container component="main" maxWidth="xs">
        <CssBaseline />
      <div>
      <FormControl component="fieldset" className={this.classes.formControl}>
        <FormLabel component="legend"><h2>Catering Events For The Day</h2></FormLabel>
        <RadioGroup aria-label="doc_id" name="doc_id" value={this.value} onChange={this.handleChange}>
          
          <FormControlLabel value="Event" control={<Radio />} label="Event" />
          <FormControlLabel value="Event 2" control={<Radio />} label="Event 2" />
          <FormControlLabel value="Event 3" control={<Radio />} label="Event 3" />
          <FormControlLabel value="Event 4" control={<Radio />} label="Event 4" />
          {this.renderList()}
          <br></br>
        </RadioGroup>
      </FormControl>
      
      
      <form onSubmit={this.onSubmit}>
      
      <Button 
        type="submit"
        fullWidth
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

export default withAuthorization(condition)(DeliverySelectionPage);
export { DeliverySelection }


// should the event be automatically pullled instead of hardcoding? 
// events for today > include date? 
// sessions for this page 