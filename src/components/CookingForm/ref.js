import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

import 'date-fns'; //npm i date-fns
import DateFnsUtils from '@date-io/date-fns'; //npm i @date-io/date-fns@1.x date-fns
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'; //npm i @material-ui/pickers

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
  hour:'',
  menu:'',
  menuAcc:'',
  custID:0,
  custExists: false,
  custref:'',
  bva: false,
  bvb: false,
  rca: false,
  rcb: false,
  dea: false,
  deb: false,
  fia: false,
  fib: false,
  menu_dict: {
    bva: "Braised Beancurd with mushroom",
    bvb: "Fried Cabbage with black fungus",
    rca: "Nasi Goreng",
    rcb: "Xin Zhou Mee Hoon",
    dea: "Ice Jelly with Cocktail",
    deb: "Chin Chow with Longan",
    fia: "Breaded Fish Fillet",
    fib: "Sweet & Sour Fish",
  }
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


class OrderFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
}
  
classes = useStyles

  componentDidMount() {  
    this.props.firebase.fs.collection('Order_ID').limit(1).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            let orderidnum = Number(change.doc.data().orderNumber)
            this.setState({orderid: orderidnum+1,
                           orderiddoc: change.doc.id })
        })
    })
    this.props.firebase.fs.collection('Customers').doc("Counter").get().then(docu=> {
      this.setState({
        custID: Number(docu.data().ID)+1
      })   
  });    
  }

  onSubmit = event => {
    event.preventDefault();
    
    
  
    let strhour = String(this.state.hour)
    let strmonth = Number(this.state.date.getMonth())+1
    let strtime = ''
    if (strhour.includes("8")||strhour.includes("9")) {
      strtime = "0"+String(this.state.hour)+String(this.state.minute)
    } else {
      strtime = String(this.state.hour)+String(this.state.minute)
    }  
    let strDate = this.state.date.getFullYear()+"-"+strmonth+"-"+this.state.date.getDate()
    let submitDate = new Date(this.state.date.getFullYear(),this.state.date.getMonth(),this.state.date.getDate(),this.state.hour,this.state.minute,0)
    let strSubmitDate = String(submitDate)

    strSubmitDate = strSubmitDate.split("GMT")[0]

    let docname = 'Event ' + this.state.orderid
    
    this.props.firebase.fs.collection('Order_ID').doc(this.state.orderiddoc).update({ orderNumber: this.state.orderid });  
    this.props.firebase.fs.collection('Catering_orders').doc(docname).set({ 
      Customer: "",
      Status: "Order Received",
      Date: submitDate,
      DateOnly: strDate,
      DeliveryCheck: false,
      Menu_ID: menuAcc,
      Pax: this.state.pax,
      Time: strtime,
      TruckImgUrl: '',
      venue: this.state.venue
    });

    if (this.state.custExists) {
      this.props.firebase.fs.collection('Customers').where("Email","==",this.state.email).get().then(snap => {
        snap.forEach(doc => {       
              console.log('Customer exists')
              this.setState({ custref: "Customers/"+doc.id})
              let dbcustref = this.props.firebase.fs.doc("Customers/"+doc.id)
              this.props.firebase.fs.doc('Catering_orders/'+docname).update({ Customer: dbcustref })
              console.log('linked catering order to customer')
  
        }) 
      })
    } else {
      console.log('Customer to be created')
      let custDocName = "Customer"+String(this.state.custID)
      this.props.firebase.fs.collection('Customers').doc(custDocName).set({
            Company: this.state.company,
            CustomerID: this.state.custID,
            Email: this.state.email,
            HP: this.state.contact,
            Name: this.state.name
      });
      this.props.firebase.fs.collection('Customers').doc("Counter").update({ ID: this.state.custID }); 
      let dbcustref = this.props.firebase.fs.doc("Customers/Customer"+this.state.custID)
      this.props.firebase.fs.doc('Catering_orders/'+docname).update({ Customer: dbcustref })
      console.log('linked catering order to customer')
    }

    this.props.history.push({
      pathname: './post-order-form',
      orderid: this.state.orderid,
      date: strSubmitDate,
      venue: this.state.venue,
      pax: this.state.pax,
    })
  }

  handleChange= name => event =>  {
    this.setState({...this.props, [name]: event.target.value});

   
    if (name == "email") {
      console.log("handled email")
      this.props.firebase.fs.collection('Customers').where("Email","==",this.state.email).get().then(snap => {
        snap.forEach(doc => {
            if (doc.exists) {
              this.setState({custExists: true})  
            } 
        });
        console.log(this.state.custExists)    
      })
    }
  }

  handleTimeChange = time => {
    if (time.target.value.includes("AM") || time.target.value.includes("12:")) {
      this.setState({
        hour: time.target.value.split(":")[0]
      })
    } else { 
      let pm = Number(time.target.value.split(":")[0])+12 
        this.setState({
          hour: pm
        }) 
    }
    let temp_str = time.target.value.split(":")[1]
    temp_str = temp_str.split(" ")[0]
    this.setState({
      minute: temp_str
    })
  }

  handleDateChange = date => {
    this.setState({
      date: date
    })
  };  

  renderSubmit() {
    if (this.state.date.length !== 0 &&
        this.state.hour.length !== 0 &&
        this.state.venue.length !== 0 &&
        this.state.pax.length !== 0 &&
        this.state.name.length !== 0 &&
        this.state.contact.length !== 0 &&
        this.state.email.length !== 0 &&
        this.state.company.length !== 0 
        // && this.state.menu.length != 0 
        ) {
      return        <form onSubmit={this.onSubmit}>
                    <button type='submit'>Submit</button>
                    </form>
    }  else {
      return <h1>Please fill in all compulsory fields and select the </h1>
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12}> {/* container justify="space-around"> */}
          date:
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              value={this.state.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            </Grid>
          </MuiPickersUtilsProvider>

        </Grid>
        <Grid item xs={12}>
        <FormControl className={this.classes.formControl}>
          <InputLabel id="demo-simple-select-label">Delivery Time</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.starttime}
            onChange={this.handleTimeChange}
          >
            <MenuItem value="9:00 AM">9:00 AM</MenuItem>
            <MenuItem value="9:15 AM">9:15 AM</MenuItem>
            <MenuItem value="9:30 AM">9:30 AM</MenuItem>
            <MenuItem value="9:45 AM">9:45 AM</MenuItem>
            <MenuItem value="10:00 AM">10:00 AM</MenuItem>
            <MenuItem value="10:15 AM">10:15 AM</MenuItem>
            <MenuItem value="10:30 AM">10:30 AM</MenuItem>
            <MenuItem value="10:45 AM">10:45 AM</MenuItem>
            <MenuItem value="11:00 AM">11:00 AM</MenuItem>
            <MenuItem value="11:15 AM">11:15 AM</MenuItem>
            <MenuItem value="11:30 AM">11:30 AM</MenuItem>
            <MenuItem value="11:45 AM">11:45 AM</MenuItem>
            <MenuItem value="12:00 PM">12:00 PM</MenuItem>
            <MenuItem value="12:15 PM">12:15 PM</MenuItem>
            <MenuItem value="12:30 PM">12:30 PM</MenuItem>
            <MenuItem value="12:45 PM">12:45 PM</MenuItem>
            <MenuItem value="1:00 PM">1:00 PM</MenuItem>
            <MenuItem value="1:15 PM">1:15 PM</MenuItem>
            <MenuItem value="1:30 PM">1:30 PM</MenuItem>
            <MenuItem value="1:45 PM">1:45 PM</MenuItem>
            <MenuItem value="2:00 PM">2:00 PM</MenuItem>
            <MenuItem value="2:15 PM">2:15 PM</MenuItem>
            <MenuItem value="2:30 PM">2:30 PM</MenuItem>
            <MenuItem value="2:45 PM">2:45 PM</MenuItem>
            <MenuItem value="3:00 PM">3:00 PM</MenuItem>
            <MenuItem value="3:15 PM">3:15 PM</MenuItem>
            <MenuItem value="3:30 PM">3:30 PM</MenuItem>
            <MenuItem value="3:45 PM">3:45 PM</MenuItem>
            <MenuItem value="4:00 PM">4:00 PM</MenuItem>
            <MenuItem value="4:15 PM">4:15 PM</MenuItem>
            <MenuItem value="4:30 PM">4:30 PM</MenuItem>
            <MenuItem value="4:45 PM">4:45 PM</MenuItem>
            <MenuItem value="5:00 PM">5:00 PM</MenuItem>
            <MenuItem value="5:15 PM">5:15 PM</MenuItem>
            <MenuItem value="5:30 PM">5:30 PM</MenuItem>
            <MenuItem value="5:45 PM">5:45 PM</MenuItem>
            <MenuItem value="6:00 PM">6:00 PM</MenuItem>
            <MenuItem value="6:15 PM">6:15 PM</MenuItem>
            <MenuItem value="6:30 PM">6:30 PM</MenuItem>
            <MenuItem value="6:45 PM">6:45 PM</MenuItem>
            <MenuItem value="7:00 PM">7:00 PM</MenuItem>
            <MenuItem value="7:15 PM">7:15 PM</MenuItem>
            <MenuItem value="7:30 PM">7:30 PM</MenuItem>
            <MenuItem value="7:45 PM">7:45 PM</MenuItem>
            <MenuItem value="8:00 PM">8:00 PM</MenuItem>
          </Select>
        </FormControl>

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

        <Grid item xs={12}>
        <FormLabel component="legend">Rice / Noodles</FormLabel>
          <FormControlLabel control={<Checkbox checked={this.state.rca} onChange={this.handleChange('rca')} color="secondary" name="foodItem" value={true} />}
            label="Nasi Goreng"/>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox checked={this.state.rcb} onChange={this.handleChange('rcb')} color="secondary" name="foodItem" value={true} />}
            label="Xin Zhou Mee Hoon"/>
        </Grid>
        <Grid item xs={12}>
        <FormLabel component="legend">Beancurd / Vegetables</FormLabel>
          <FormControlLabel control={<Checkbox checked={this.state.bva} onChange={this.handleChange('bva')} color="secondary" name="foodItem" value={true} />}
            label="Braised Beancurd with mushroom"/> 
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox checked={this.state.bvb} onChange={this.handleChange('bvb')} color="secondary" name="foodItem" value={true} />}
            label="Fried Cabbage with black fungus"/> 
        </Grid>
        <Grid item xs={12}>
        <FormLabel component="legend">Fish</FormLabel>
          <FormControlLabel control={<Checkbox checked={this.state.fia} onChange={this.handleChange('fia')} color="secondary" name="foodItem" value={true} />}
            label="Breaded Fish Fillet"/> 
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox checked={this.state.fib} onChange={this.handleChange('fib')} color="secondary" name="foodItem" value={true} />}
            label="Sweet & Sour Fish"/> 
        </Grid>
        <Grid item xs={12}>
        <FormLabel component="legend">Dessert</FormLabel>
          <FormControlLabel control={<Checkbox checked={this.state.dea} onChange={this.handleChange('dea')} color="secondary" name="foodItem" value={true} />}
            label="Ice Jelly with Cocktail"/> 
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox checked={this.state.deb} onChange={this.handleChange('deb')} color="secondary" name="foodItem" value={true} />}
            label="Chin Chow with Longan"/> 
        </Grid>
    </React.Fragment>
    <div>{this.renderSubmit()}</div>
      </div>

    );
  }

}

const OrderForm = withRouter(withFirebase(OrderFormBase));

export default OrderForm;
