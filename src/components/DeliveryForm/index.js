import React, { Component } from 'react';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import FileUploader from "react-firebase-file-uploader";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';


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
  strDate:'',
  menu: ''
};  

class DeliveryFormBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
}
  componentDidMount() { 
    // console.log(this.props.location.doc_id)
    this.props.firebase.fs.collection('Catering_orders').doc("ATQjjgqvKU8n49QdSuR7").get().then(doc=> {
      // console.log(doc.data())
          this.setState({
            catering_event_doc: doc.id,
            date: String(doc.data().Date.toDate()).split("GMT")[0], 
            menu: doc.data().Menu,
            venue: doc.data().venue,
            pax: doc.data().Pax,
          }) 
      })
      let temp_date = String(this.state.date)
      console.log(this.state.date )
      this.setState({
        strDate: temp_date.split("GMT")[0]
      })
    this.props.firebase.fs.collection('Catering_orders').doc("ATQjjgqvKU8n49QdSuR7").get().then(doc=> {
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
    if (this.state.cleanReady === true && (this.state.allItems === true && this.state.foodWrap === true && this.state.imageURL.length !== 0)) {
        return        <form onSubmit={this.onSubmit}>
                      <button type='submit'>Submit</button>
                      </form>
    } else {
      return <h1>Please check all 3 checkboxes and upload a picture of the truck.</h1>
    }
  }

  render() {
    // console.log(typeof this.state.menu)
    return (  
<div>
  {this.state.menu}
      {/* <h1>{this.props.location.doc_id}</h1> */}
      <React.Fragment>
        
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
          {/* {this.state.menu.map((test, index) =><tr>{test}</tr>)} */}

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
