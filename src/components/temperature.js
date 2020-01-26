import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../App.css';
import { withFirebase } from './Firebase';

const INITIAL_STATE = {
    min_temp: 0, 
    min_temp_doc_id: '',
    current: 0,
    new_min_temp: ''
};  

class TemperatureDisplayBase extends Component{

    constructor(props) {
        super(props);
        this.state = {
            // min_temp: 0, 
            // min_temp_doc_id: '',
            // current: 0,
            // new_min_temp: ''
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        this.props.firebase.fs.collection('device_settings').onSnapshot(snapshot => { //to me, this is the 60 threshold. 
            let changes = snapshot.docChanges();                           //if a new value is keyed in, update the value 
            changes.forEach(change => {                                     // both in the constant and in db. 
                if (change.doc.data().name === 'temperature sensor'){
                    // this.state.min_temp = change.doc.data().minimum
                    this.setState({
                        min_temp: change.doc.data().minimum, //pulls from MINIMUM
                        min_temp_doc_id: change.doc.id      //the device settings doc id will change, so must update here for reference.
                    })
                }
            })
        })
        
        this.props.firebase.fs.collection('temp_sensor_test').orderBy('timestamp','desc').limit(1).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                this.setState({current: change.doc.data().temp}) //this is what the temp is. if i replace temp with timestamp then it changes
            })
        })
    }

    onSubmit = event => {
        event.preventDefault();
        let num = Number(this.state.new_min_temp); //sets the var
        // let num = this.new_min_temp;
        console.log(num)
        console.log(typeof num)
        this.props.firebase.fs.collection('device_settings').doc(this.state.min_temp_doc_id).update({ minimum: num }); //UPDATE FIRESTORE

        this.setState({new_min_temp: ''}) 
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value 
        });
    }

    render() {
        const {new_min_temp} = this.state; 

        return ( 
            <div>            
                <p>Temperature Threshold: {this.state.min_temp}</p>
                <p>Current Temperature: {this.state.current}</p>
                <form onSubmit={this.onSubmit}>
                    <input 
                        name='new_min_temp'
                        value={new_min_temp}
                        onChange={this.onChange}
                        type="number"
                        palceholder="New mininium temperature"
                    />
                    <button type='submit'>Submit</button>
                </form>
            </div>
        );
    }
}

const TemperatureDisplay = withRouter(withFirebase(TemperatureDisplayBase));

export default TemperatureDisplay