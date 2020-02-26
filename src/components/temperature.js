import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../App.css';
import { withFirebase } from './Firebase';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import { positions } from '@material-ui/system';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    root: {
        flexGrow: 1,
        align:"center"
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 200,
    },
  }));

const INITIAL_STATE = {
    minTemp: 0, 
    minTempDocID: '',
    current: 0,
    newMinTemp: ''
};  

class TemperatureDisplayBase extends Component{

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.classes = { useStyles }
        
    }

    componentDidMount() {
        this.props.firebase.fs.collection('device_settings')
            .onSnapshot(snapshot => { //to me, this is the 60 threshold. 
                let changes = snapshot.docChanges();                           //if a new value is keyed in, update the value 
                changes.forEach(change => {                                     // both in the constant and in db. 
                    if (change.doc.data().name === 'temperature sensor'){
                        // this.state.minTemp = change.doc.data().minimum
                        this.setState({
                            minTemp: change.doc.data().minimum, //pulls from MINIMUM
                            minTempDocID: change.doc.id      //the device settings doc id will change, so must update here for reference.
                        })
                    }
                })
            })
        
        this.props.firebase.fs.collection('temp_sensor_test')
            .orderBy('timestamp','desc').limit(1)
            .onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    this.setState({current: change.doc.data().temp}) //this is what the temp is. if i replace temp with timestamp then it changes
                })
            })
        
    }

    handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
		});
    };
    
    onSubmit = event => {
        event.preventDefault();
        let num = Number(this.state.newMinTemp); //sets the var
        // let num = this.newMinTemp;
        console.log(num)
        console.log(typeof num)
        this.props.firebase.fs.collection('device_settings')
            .doc(this.state.minTempDocID)
            .update({ 
                minimum: num 
            }); //UPDATE FIRESTORE

        this.handleClickOpen()
        this.setState({newMinTemp: ''}) 

    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value 
        });
    }

    render() {
        const {newMinTemp} = this.state; 

        return ( 
            <div align="center" className={this.classes.root}>
            {/* <Paper className={this.classes.paper}>        */}
                <p>Temperature Threshold: {this.state.minTemp}</p>
                <p>Current Temperature: {this.state.current}</p>
                <form onSubmit={this.onSubmit}>
                
                <div style={{ alignSelf: 'center' }}>
                    <TextField 
                        name='newMinTemp'
                        value={newMinTemp}
                        onChange={this.onChange}
                        label="Set Threshold"
                        defaultValue="65"
                        type="Number"
                        variant="outlined"
                        margin="dense"
                        align="left"
                    /></div>

                    <Button style={{ alignSelf: 'center' }}
                        // disabled={isInvalid} 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={this.classes.submit}
                        margin="normal">
                        Submit
                    </Button>
            
                    <Dialog
							open={this.state.open}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{"Submission Notification"}
							</DialogTitle>
							<DialogContent dividers>
								<DialogContentText id="alert-dialog-description">
									Temperature has been changed to {this.state.minTemp}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary" autoFocus>
									Confirm
								</Button>
							</DialogActions>
						</Dialog>

                </form>
                {/* </Paper>   */}
            </div>
        );
    }
}

const TemperatureDisplay = withRouter(withFirebase(TemperatureDisplayBase));

export default TemperatureDisplay