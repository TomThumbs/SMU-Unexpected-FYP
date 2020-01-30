import React, { Component } from 'react';
import ReactDOM from 'react-dom'
// import logo from '../logo.svg';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
// import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

class DeliveryFormBase extends Component {

  state = {
    image: '',
    imageURL: '',
    progress: 0
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
  }

  handleProgress = progress => {
    this.setState({
      progress: progress
    })
  }

  render() {
    return (
<div>
      <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          17/01/2020 10:00 A.M.
          {/* <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="fname"
          /> */}
        </Grid>
        <Grid item xs={12} >
          {/* <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="lname"
          /> */}
          Singapore Management University
        </Grid>
        <Grid item xs={12}>
          {/* <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
          /> */}
          60 Pax
        </Grid>
        <Grid item xs={12}>
          {/* <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="billing address-line2"
          /> */}
          Cust Name: Yeow Leong
        </Grid>
        <Grid item xs={12}>
          {/* <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
          /> */}
          Cust HP: 999
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField id="state" name="state" label="State/Province/Region" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid> */}
        <Grid item xs={12}></Grid>
      </Grid>
        <Typography variant="h6" gutterBottom>
            Checklist 
        </Typography>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="cleanReady" value="yes" />}
            label="Is the vehicle cleaned and ready for transportation?"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="allItems" value="yes" />}
            label="Are all the items required for the event on the vehicle?"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="foodWrap" value="yes" />}
            label="Are all the food wrapped properly?"
          />
        </Grid>

        <Typography variant="h6" gutterBottom>
              Take a photograph of the state of the vehicle and food before delivery commences
        </Typography>
    </React.Fragment>
        
        <label> Progress</label>
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
        <br/>
        <br/>
        <React.Fragment>
                <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit"
          >
            Submit Checklist
          </Button>
    </React.Fragment>
      </div>

    );
  }

}

const DeliveryForm = withRouter(withFirebase(DeliveryFormBase));

export default DeliveryForm;
