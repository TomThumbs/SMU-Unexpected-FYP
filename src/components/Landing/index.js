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
  dict_test: []
}

class LandingPageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...INITIAL_STATE
    };
}  

    componentDidMount() {  
        this.props.firebase.fs.collection('Catering_orders').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                this.state.dict_test.push({
                  key:change.doc.id,
                  value: [change.doc.data().Date,change.doc.data().Time,change.doc.data().Venue,change.doc.data().Pax]
                });
              })
        })
        console.log(this.state.dict_test)
      }

render() {
//problem cannot render the dict stuff out into a table format. 
  for (var key in this.state.dict_test){
    console.log( key, this.state.dict_test[key] );
  }

  return (

  <div>
    <h1>Landing</h1>
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
