import React, { Component } from 'react';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
console.log = console.warn = console.error = () => {};

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

      let tempDate = new Date()
      tempDate.setHours(0)
      tempDate.setMinutes(0)
      // console.log(tempDate)
      let sevenDate = new Date(tempDate.getTime() + 8 * 86400000 )
      sevenDate.setHours(23)
      sevenDate.setMinutes(0)
      // console.log(sevenDate)
      let tmrDate = new Date(tempDate.getTime() + 1 * 86400000 )
      sevenDate.setHours(0)
      sevenDate.setMinutes(0)
      
      this.props.firebase.fs.collection('Catering_orders').get().then(snapshot=>{
        let tempMonth = Number(tempDate.getMonth())+1
        let compareDate = tempDate.getFullYear() + "-" + tempMonth + "-" + tempDate.getDate()
          snapshot.forEach(doc => {
          if (doc.data().DateOnly === compareDate) {
            // console.log(doc.data())
            this.setState((prevstate) => ({
              events_list: [...prevstate.events_list, {
                docid:doc.id,
                date: doc.data().DateOnly,
                venue: doc.data().venue,
                pax: doc.data().Pax
              }]
            }))

          }
        });
      })
      // let week_events_str = ''
      this.props.firebase.fs.collection('Catering_orders')
      .where("Date", ">=", tmrDate)
      .where("Date", "<=", sevenDate)
      .get().then(snapshot=>{
          snapshot.forEach(doc => {
            this.setState((prevstate) => ({
              week_events_list: [...prevstate.week_events_list, {
                docid: doc.id,
                date: doc.data().DateOnly,
                venue: doc.data().venue,
                pax: doc.data().Pax
              }]
            }))
        });
      })

    }

  renderEvents(eventlist){
    let result = [];
    // console.log(eventlist)
    eventlist.forEach((evt) => {
      // console.log(evt)
      let temp = [];
      Object.values(evt).forEach((test,id) => {
        temp.push(<Typography key={id}>{test}</Typography>)
        // console.log(entry);
      })
      temp.push(<br/>)
      result.push(temp);
    })
    return result;
  }

  render() {

  return (
    <Container component="main" maxWidth="xs">
  <div>


    <h1>Events for Today</h1>
    
      {this.renderEvents(this.state.events_list)}

    <h1>Events for the week</h1>

      {this.renderEvents(this.state.week_events_list)}

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
