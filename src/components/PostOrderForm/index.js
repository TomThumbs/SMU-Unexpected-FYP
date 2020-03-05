import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import { Link as RouterLink } from 'react-router-dom';

// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

class PostOrderFormBase extends Component {
	
	renderRemarks() {
		if (this.props.location.remarks.length !== 0) {
			return (
				this.griditem("Remarks:",this.props.location.remarks)
			);
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
		this.props.location.Menu.forEach((item, id) => {
			list.push(<li key={id}>{item}</li>);
		});
		return list;
	}

	render() {
		console.log(this.props.location.Menu);
		return (
			<Container component="main" maxWidth="sm">
				
					{/* <Typography component="h4" variant="h4">Order Summary</Typography>
                <Typography component="h5" variant="h7">Order No.</Typography>
                <Typography component="h5" variant="h7">#{this.props.location.orderID}</Typography>
                <Typography component="h5" variant="h7">Date: {this.props.location.date.split(' ')[1]}/{this.props.location.date.split(' ')[2]}/{this.props.location.date.split(' ')[3]}</Typography>
                <Typography component="h5" variant="h7">Time: {this.props.location.date.split(' ')[4]}</Typography>
                <Typography component="h5" variant="h7"> Venue Postal Code: {this.props.location.venue}</Typography>
                <Typography component="h5" variant="h7">{this.props.location.pax} pax</Typography> */}

				<Typography component="h4" variant="h4">
					Order Summary
				</Typography>
					<br></br>
				<Paper>
					<Typography variant="h6" gutterBottom color="primary">Order Number: {this.props.location.orderID}</Typography>
					{/* {this.griditem("Order Number:", this.props.location.orderID)} */}
					{this.griditem("Customer Name:", this.props.location.custname)}
					{this.griditem("Customer Contact:", this.props.location.custcontact)}
					{this.griditem("Customer Email:", this.props.location.custemail)}
					{this.griditem("Customer Company:", this.props.location.custcompany)}
					
					
					<br></br>
					{this.griditem(
						"Date:",
						this.props.location.date.split(" ")[2] +
							" " +
							this.props.location.date.split(" ")[1] +
							" " +
							this.props.location.date.split(" ")[3]
					)}
					{this.griditem("Time:", this.props.location.time)}
					{this.griditem("Venue:", this.props.location.venue)}
					{this.griditem("Pax:", this.props.location.pax)}
					<br></br>
					{this.griditem("Payment Method:", this.props.location.payment)}
					<br></br>
					{this.renderRemarks()}

					{/* {this.griditem("Order ID:","test")}
                {this.griditem("Date:","test")}
                {this.griditem("Time:","test")}
                {this.griditem("Venue:","test")}
                {this.griditem("Unit Number:","test")}
                {this.griditem("Pax:", "test")} */}

				
					<p><Divider variant="il" /></p>
			
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
