import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import { Link as RouterLink } from 'react-router-dom';

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

class PostOrderFormBase extends Component {
	
	renderRemarks() {
		if (this.props.location.state.remarks.length !== 0) {
			let result = []
			result.push(<br />)
			result.push(this.griditem("Remarks:",this.props.location.state.remarks))
			return result 
		} 
	}

	griditem(title,info){
		return (
			<Grid container> 
				<Grid item xs={5}>{title}</Grid>
				<Grid item xs={7}><b>{info}</b></Grid>
			</Grid>
		)
	}

	renderMenu() {
		let list = [];
		this.props.location.state.Menu.forEach((item, id) => {
			list.push(<li key={id}>{item}</li>);
		});
		return list;
	}

	render() {
		return (
			<Container component="main" maxWidth="sm">
				
					{/* <Typography component="h4" variant="h4">Order Summary</Typography>
                <Typography component="h5" variant="h7">Order No.</Typography>
                <Typography component="h5" variant="h7">#{this.props.location.state.orderID}</Typography>
                <Typography component="h5" variant="h7">Date: {this.props.location.state.date.split(' ')[1]}/{this.props.location.state.date.split(' ')[2]}/{this.props.location.state.date.split(' ')[3]}</Typography>
                <Typography component="h5" variant="h7">Time: {this.props.location.state.date.split(' ')[4]}</Typography>
                <Typography component="h5" variant="h7"> Venue Postal Code: {this.props.location.state.venue}</Typography>
                <Typography component="h5" variant="h7">{this.props.location.state.pax} pax</Typography> */}

				<Typography component="h4" variant="h4">
					Order Summary
				</Typography>
					<br></br>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">Order Number: {this.props.location.state.orderID}</Typography>
					{/* {this.griditem("Order Number:", this.props.location.state.orderID)} */}
					{this.griditem("Customer Name:", this.props.location.state.custname)}
					{this.griditem("Customer Contact:", this.props.location.state.custcontact)}
					{this.griditem("Customer Email:", this.props.location.state.custemail)}
					{this.griditem("Customer Company:", this.props.location.state.custcompany)}
					
					
					<br></br>
					{this.griditem(
						"Date:",
						this.props.location.state.date.split(" ")[2] +
							" " +
							this.props.location.state.date.split(" ")[1] +
							" " +
							this.props.location.state.date.split(" ")[3]
					)}
					{this.griditem("Time:", this.props.location.state.time)}
					{this.griditem("Venue:", this.props.location.state.venue)}
					{this.griditem("Pax:", this.props.location.state.pax)}
					<br></br>
					{this.griditem("Payment Method:", this.props.location.state.payment)}
					{this.renderRemarks()}
					<br></br>

					{/* {this.griditem("Order ID:","test")}
                {this.griditem("Date:","test")}
                {this.griditem("Time:","test")}
                {this.griditem("Venue:","test")}
                {this.griditem("Unit Number:","test")}
                {this.griditem("Pax:", "test")} */}

				
					<br/><Divider variant="middle" /><br/>
			
					<Typography variant="h6" >Dishes ordered</Typography>
					
					{this.renderMenu()}

					
					<br></br>

					<Grid container spacing={1}>
						<Grid container item xs={12} spacing={0}>
							<Button
								component={RouterLink} to={ROUTES.ORDER_FORM}
								color="secondary"
								fullWidth
								variant="outlined"
							>
								Create New Order
							</Button>
						</Grid>
						<Grid container item xs={12} spacing={0}>
							<Button
								component={RouterLink} to={ROUTES.LANDING}
								color="primary"
								fullWidth
								variant="outlined"
							>
								Home
							</Button>
						</Grid>
					</Grid>
					</Paper>
			</Container>
			
		);
	}
}

const PostOrderForm = withRouter(withFirebase(PostOrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(PostOrderForm);
