import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const INITIAL_STATE = {
  orderid: 0,
  orderiddoc: '',
  date: '',
  starttime:'',
  endtime:'',
  venue: '',
  pax: 0,
  name: '',
  contact: '',
  email: '',
  company: '',
  menu: ''
}

class OrderFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
}
  
  componentDidMount() {  
    this.props.firebase.fs.collection('Order_ID').limit(1).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            let orderidnum = Number(change.doc.data().orderNumber)
            this.setState({orderid: orderidnum+1,
                           orderiddoc: change.doc.id })
            // console.log(this.state.orderid)
          })
    })
  }

  onSubmit = event => {
    event.preventDefault();
    // let orderidnum = Number(this.state.orderid); 
    // let paxnum = Number(this.state.pax);
    let docname = 'Event ' + this.state.orderid
    this.props.firebase.fs.collection('Order_ID').doc(this.state.orderiddoc).update({ orderNumber: this.state.orderid }); //counts current order number. 
    this.props.firebase.fs.collection('Catering_orders').doc(docname).set({ 
      Customer: "idk how to reference", //problem
      Date: this.state.date,
      DeliveryCheck: false,
      Menu_ID: "underway",
      Pax: this.state.pax,
      Time: this.state.starttime,
      TruckImgUrl: '',
      venue: this.state.venue
    });
    
    this.props.history.push({
      pathname: './post-order-form',
      orderid: this.state.orderid,
      date: this.state.date,
      starttime: this.state.starttime,
      endtime: this.state.endtime,
      venue: this.state.venue,
      pax: this.state.pax,
      name: this.state.name,
      contact: this.state.contact,
      email: this.state.email,
      company: this.state.company,
      menu: this.state.menu
    })
  }

  handleChange= name => event =>  {
    this.setState({...this.props, [name]: event.target.value});
    // console.log(this.state.date)
  }

  renderSubmit() {
    if (this.state.date.length !== 0 &&
        this.state.starttime.length !== 0 &&
        this.state.endtime.length !== 0 &&
        this.state.venue.length !== 0 &&
        this.state.pax.length !== 0 &&
        this.state.name.length !== 0 &&
        this.state.contact.length !== 0 &&
        this.state.email.length !== 0 &&
        this.state.company.length !== 0 
        // && this.state.menu.length != 0
        //problem menu how to render properly. 
        ) {
      return        <form onSubmit={this.onSubmit}>
                    <button type='submit'>Submit</button>
                    </form>
    }  
  }

  render() {
    return (
<div>
      <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order Creation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
        Order ID: {this.state.orderid}
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="date" 
            name="date"
            label="Delivery Date:"
            autoComplete="date"
            value={this.state.value}
            onChange={this.handleChange('date')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="starttime" 
            name="starttime"
            label="Delivery Time:"
            autoComplete="starttimetime"
            value={this.state.value}
            onChange={this.handleChange('starttime')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="endtime" 
            name="endtime"
            label="Pack Time:"
            autoComplete="endtime"
            value={this.state.value}
            onChange={this.handleChange('endtime')}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            required
            id="venue"
            name="venue"
            label="Venue:"
            autoComplete="venue"
            placeholder="Postal Code"
            value={this.state.value}
            onChange={this.handleChange('venue')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="pax"
            name="pax"
            label="Pax:"
            autoComplete="pax"
            value={this.state.value}
            onChange={this.handleChange('pax')}
          />
    
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="name"
            name="name"
            label="Customer details:"
            placeholder="Name"
            autoComplete="name"
            value={this.state.value}
            onChange={this.handleChange('name')}
          />
          
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="contact"
            name="contact"
            // label="contact"
            placeholder="Contact Number"
            autoComplete="contact"
            value={this.state.value}
            onChange={this.handleChange('contact')}
          />
       
        </Grid>

        <Grid item xs={12}>
        <TextField
            required
            id="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.value}
            onChange={this.handleChange('email')}
          />
        </Grid>
        <Grid item xs={12}>
        <TextField
            required
            id="company"
            name="company"
            placeholder="Company/ Organization"
            autoComplete="company"
            value={this.state.value}
            onChange={this.handleChange('company')}
          />
        </Grid>
      </Grid>
      
      <Typography variant="h6" gutterBottom>
              Menu selection:
        </Typography>

        <Typography variant="h5" gutterBottom>
              (select where applicable)
        </Typography>    

        {/* <FormControl component="fieldset" className="base">
        <FormLabel component="legend">Rice/Noodle</FormLabel>
        <RadioGroup aria-label="base" name="base" value="tochange" onChange="tochange"> 
        TO CHANGE VALUE AND ONCHANGE.. https://material-ui.com/components/radio-buttons/
          <FormControlLabel value="beehoon" control={<Radio />} label="Bee Hoon" />
          <FormControlLabel value="hokkienmee" control={<Radio />} label="Hokkien Mee" />
        </RadioGroup>
      </FormControl> */}
    </React.Fragment>
    <div>{this.renderSubmit()}</div>
      </div>

    );
  }

}

const OrderForm = withRouter(withFirebase(OrderFormBase));

export default OrderForm;
