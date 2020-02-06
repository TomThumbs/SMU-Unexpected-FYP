import React, { Component } from 'react';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const INITIAL_STATE = {
  orderiddoc: '',
  date: '',
  starttime:'',
  venue: '',
  pax: 0,
  events: '',
  week_events:'',
  events_list: [],
  week_events_list: []
}

class LandingPageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
    this.classes = { useStyles }
  }  

    componentDidMount() {  
      let events_str = ''

      let tempDate = new Date()
      tempDate.setHours(0)
      tempDate.setMinutes(0)
      console.log(tempDate)
      let sevenDate = new Date(tempDate.getTime() + 8 * 86400000 )
      sevenDate.setHours(23)
      sevenDate.setMinutes(0)
      console.log(sevenDate)
      let tmrDate = new Date(tempDate.getTime() + 1 * 86400000 )
      sevenDate.setHours(0)
      sevenDate.setMinutes(0)
      
      this.props.firebase.fs.collection('Catering_orders').get().then(snapshot=>{
        let tempMonth = Number(tempDate.getMonth())+1
        let compareDate = tempDate.getFullYear() + "-" + tempMonth + "-" + tempDate.getDate()
          snapshot.forEach(doc => {
            // console.log(compareDate+","+doc.data().DateOnly)
          if (doc.data().DateOnly == compareDate) {
            this.setState({
              events: events_str+ doc.id + ". Date: " + doc.data().DateOnly + ". Venue: " + doc.data().venue + ". Pax: " + doc.data().Pax + ","
            })
            events_str = this.state.events
          }
        });
      })
      let week_events_str = ''
      this.props.firebase.fs.collection('Catering_orders')
      .where("Date", ">=", tmrDate)
      .where("Date", "<=", sevenDate)
      .get().then(snapshot=>{
          snapshot.forEach(doc => {
            console.log("___"+doc.id)
          // if (doc.data().DateOnly == compareDate) {
            this.setState({
              week_events: week_events_str+ doc.id + ". Date: " + doc.data().DateOnly + ". Venue: " + doc.data().venue + ". Pax: " + doc.data().Pax + ","
            })
            week_events_str = this.state.week_events
          // }
        });
      })      
    }

  render() {
    {this.state.events_list = this.state.events.split(",")}
    {this.state.week_events_list = this.state.week_events.split(",")}

  return (
    <Container component="main" maxWidth="xs">
   
  <div>


    <h1>Events for Today</h1>
    <table>
    {this.state.events_list.map((test, index) =>
        <tr>{test}</tr>)}
    </table>
    <h1>Events for the week</h1>
    <table>
    {this.state.week_events_list.map((test, index) =>
        <tr>{test}</tr>)}
    </table>
  </div>
  </Container>


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
