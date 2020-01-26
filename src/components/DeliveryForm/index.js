import React, { Component } from 'react';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import FileUploader from "react-firebase-file-uploader";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


const INITIAL_STATE = {
  image: '',
  imageURL: '',
  progress: 0,
  catering_event_doc: '',
  cleanReady: "",
  allItems: "",
  foodWrap: "",
  date: '',
  starttime:'',
  venue: '',
  pax: 0,
  name: '',
  contact: '',
  email: '',
  
};  

class DeliveryFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
}
  componentDidMount() { 
    this.props.firebase.fs.collection('Catering_orders').doc(this.props.location.doc_id).get().then(doc=> {
          this.setState({
            catering_event_doc: doc.id,
            date: doc.data().Date,
            starttime:doc.data().Time,  
            venue: doc.data().Venue,
            pax: doc.data().Pax,
          }) 
      })
    this.props.firebase.fs.collection('Catering_orders').doc("Event 2").get().then(doc=> {

          this.setState({
            name: doc.data().Customer.id
          })
          this.props.firebase.fs.collection('Customers').doc(this.state.name).get().then(docu=> {
            this.setState({
              contact: docu.data().HP,
              name: docu.data().Name
            })            
        });            
      });    
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.firebase.fs.collection('Catering_orders').doc(this.state.catering_event_doc).update({ DeliveryCheck: true }); //UPDATE FIRESTORE
    this.props.firebase.fs.collection('Catering_orders').doc(this.state.catering_event_doc).update({ TruckImgURL: this.state.imageURL });
    this.setState({imageURL: ''}) 
    this.props.history.push('./post-delivery-form');
  }

  handleUploadStart = () => {
    this.setState({
      progress: 0
    })
  }

  handleUploadSuccess = filename => {
    this.setState({
      image:filename,
      progress: 100
    })
    
    this.props.firebase.stg.ref('truckHistory').child(filename).getDownloadURL().then(url=> 
      this.setState({
      imageURL: url
    }))

  }

  handleProgress = progress => {
    this.setState({
      progress: progress,
      imageURL: ''
    })
  }

  handleChange = name => event => {
    this.setState({ ...this.props, [name]: event.target.checked });
    // console.log(this.state.cleanReady)
    // console.log(this.state.allItems)
    // console.log(this.state.foodWrap)
  };

  renderSubmit() {
    if (this.state.cleanReady == true && (this.state.allItems == true && this.state.foodWrap == true && this.state.imageURL.length != 0)) {
        return        <form onSubmit={this.onSubmit}>
                      <button type='submit'>Submit</button>
                      </form>
    } else {
      return <h1>Please check all 3 checkboxes and upload a picture of the truck.</h1>
    }
  }

  render() {
    return (  
<div>
      <h1>{this.props.location.doc_id}</h1>
      <React.Fragment>
        
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {this.state.date}
        </Grid>
        <Grid item xs={12} >
        {this.state.venue}
        </Grid>
        <Grid item xs={12}>

        {this.state.pax} Pax
        </Grid>
        <Grid item xs={12}>
        
          Cust Name: {this.state.name}
        </Grid>
        <Grid item xs={12}>

          Cust HP: {this.state.contact}
        </Grid>
        
        <Grid item xs={12}></Grid>
      </Grid>
        <Typography variant="h6" gutterBottom>
            Checklist 
        </Typography>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={this.state.cleanReady} onChange={this.handleChange('cleanReady')} color="secondary" name="cleanReady" value="cleanReady" />}
            // <Checkbox checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />
            label="Is the vehicle cleaned and ready for transportation?"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={this.state.allItems} onChange={this.handleChange('allItems')} color="secondary" name="allItems" value="allItems" />}
            label="Are all the items required for the event on the vehicle?"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={this.state.foodWrap} onChange={this.handleChange('foodWrap')} color="secondary" name="foodWrap" value="foodWrap" />}
            label="Are all the food wrapped properly?"
          />
        </Grid>

        <Typography variant="h6" gutterBottom>
              Take a photograph of the state of the vehicle and food before delivery commences
        </Typography>
    </React.Fragment>
        
        <label> Progress: {this.props.imageURL}</label>
        <p>{this.state.progress}</p>
        <br/>
        <FileUploader
          accept="image/*"
          name='image'
          storageRef={this.props.firebase.stg.ref('truckHistory')}
          onUploadStart={this.handleUploadStart}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
        />
        <div>{this.renderSubmit()}</div>
      </div>
    );
  }
}

const DeliveryForm = withRouter(withFirebase(DeliveryFormBase));

export default DeliveryForm;
