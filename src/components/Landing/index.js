import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  orderiddoc: '',
  date: '',
  starttime:'',
  venue: '',
  pax: 0,
  dict_test: '',
  dick_test: []
}

class LandingPageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
  }  

    componentDidMount() {  
      let dict_test_str = ''
        this.props.firebase.fs.collection('Catering_orders').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
              this.setState({
                dict_test: dict_test_str+ change.doc.id + ". Date: " + change.doc.data().DateOnly + ". Venue: " + change.doc.data().venue + ". Pax: " + change.doc.data().Pax + ","
              })
              dict_test_str = this.state.dict_test
              })
        })
      }

  render() {
    {this.state.dick_test = this.state.dict_test.split(",")}

  return (
   
  <div>


    <h1>Landing</h1>
    <table>
    {this.state.dick_test.map((test, index) =>
        <tr>{test}</tr>)}
    </table>
  </div>


    );
  }
}
const LandingPage = withRouter(withFirebase(LandingPageBase));
export default LandingPage;

//see i can probably dev the part to pull...and when i get multiple results, how do i know which to render to???
//dont think i can for each it leh. 

// import React from 'react';

// const LandingPage = () => (
//   <div>
//     <h1>Landing</h1>
//   </div>
// );

// export default LandingPage;
