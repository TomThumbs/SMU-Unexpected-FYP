import React, { Component } from 'react';
import '../../App.css';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
// console.log = console.warn = console.error = () => {};


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
                docID:doc.id,
                orderID: doc.data().orderID,
                date: doc.data().DateOnly,
                venue: doc.data().venue,
                pax: doc.data().Pax,
                status: doc.data().Status,
                time: doc.data().apmTime,
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
                docID: doc.id,
                orderID: doc.data().orderID,
                date: doc.data().DateOnly,
                venue: doc.data().venue,
                pax: doc.data().Pax,
                status: doc.data().Status,
                time: doc.data().apmTime,
              }]
            }))
        });
      })

    }

  renderEvents(eventlist){
    let eventid = [];
    // console.log(eventlist)
    eventlist.forEach((evt) => {
      // console.log(evt)
      let temp = [];
      Object.values(evt).forEach((test,id) => {
        temp.push(<Typography key={id}>{test}</Typography>)
        // console.log(entry);
      })
      temp.push(<br/>)
      eventid.push(temp[0]);
    })
    return eventid;
  }


  linktoevent(id){
    var link = ""
    return (link.concat("order-timeline?id=", id))
  }



  createTable(eventlist) {
		if (
      eventlist.length === 0
		) {
			return (
				"No Upcoming Events"
			);
		} else {
			return (
				<TableContainer>
        <Table className={this.classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Order ID</TableCell>
              <TableCell align="right">Venue</TableCell>
              <TableCell align="right">Pax</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {eventlist.map(row => (
              <TableRow key={row.orderID}>
                <TableCell component="th" scope="row">{row.date}</TableCell>
                <TableCell align="right">{row.time}</TableCell>
                <TableCell align="right">{row.orderID}</TableCell>
                <TableCell align="right">{row.venue}</TableCell>
                <TableCell align="right">{row.pax}</TableCell>
                <TableCell align="right">
                  <Button component={RouterLink} to={this.linktoevent(row.orderID)} color="primary">{row.status}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
			);
		}
	}

  render() {

  return (
      <Container component="main" maxWidth="md">
        
        <div>
          <h1>Events for Today</h1>
          {this.createTable(this.state.events_list)}
        </div>
        <br></br><br></br>
        <div>
          <h1>Events for the Next 7 Days</h1>
          {this.createTable(this.state.week_events_list)}
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

