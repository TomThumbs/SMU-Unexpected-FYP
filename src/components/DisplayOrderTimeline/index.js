import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import Paper from '@material-ui/core/Paper';
// import { CssBaseline } from '@material-ui/core';
// import TimelineItem from './timelineItem'

import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const INITIAL_STATE = {
  orderID: '',
  statusList: ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete'],
  status: '',
};  

class DisplayOrderTimelineBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles };
  }

  componentDidMount(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let urlId = Number(urlParams.get('id'));
    console.log(urlId)
    this.setState({
      orderID: urlId
    });

    console.log("Retreving doc")
    this.props.firebase.fs.collection('Catering_orders').where("orderID", "==", urlId).get()
    .then(querySnapshot => {
      // console.log(urlId);
      querySnapshot.forEach(doc => {
        console.log(doc.data());
        this.setState({
          status: doc.data().Status
        })
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    console.log("Retrieved doc")
  }

  timelineItem(key, itemIndex, status){
    const isDone = this.state.statusList.indexOf(itemIndex) <= this.state.statusList.indexOf(status);

    return(
      <div key={key} className="timeline-item">
        <div className="timeline-item-content">
          <span className="tag"></span>
          <p>{itemIndex}</p>
          {isDone ? <Link 
            to={{
              pathname: ROUTES.ORDER_RECEIVED,
              search: '?id=' + this.state.orderID
            }}>
              Read
            </Link>: <p>Not done yet</p>}
          <span className="circle" />
        </div>
      </div>
    )
  }

  timeline(){
    return(
      <div className="timeline-container">
        {this.state.statusList.map((data, idx) => (
          this.timelineItem(idx, data, this.state.status)
        ))}
      </div>
    )
  }

  render(){
    return(
      <Container component="main" maxWidth="xs">
        {this.timeline()}
      </Container>
    )
  }
}

const DisplayOrderTimeline = withRouter(withFirebase(DisplayOrderTimelineBase));

export default DisplayOrderTimeline