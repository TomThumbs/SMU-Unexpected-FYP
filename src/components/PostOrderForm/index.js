import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

class PostOrderFormBase extends Component {
	griditem = (header, item) => {
		return (
			<Grid container spacing={2}>
				<Grid item xs>
					{header}
				</Grid>

				<Grid item>
					<b> {item} </b>
				</Grid>
			</Grid>
		);
	};

	renderMenu() {
		let list = [];
		this.props.location.Menu.forEach((item, id) => {
			list.push(<Typography key={id}>{item}</Typography>);
		});
		return list;
	}

	render() {
		console.log(this.props.location.Menu);
		return (
			<div className="body">
				<Container component="main" maxWidth="xs">
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

					{this.griditem("Order ID:", this.props.location.orderID)}
					{this.griditem(
						"Date:",
						this.props.location.date.split(" ")[2] +
							" " +
							this.props.location.date.split(" ")[1] +
							" " +
							this.props.location.date.split(" ")[3]
					)}
					{this.griditem("Time:", this.props.location.date.split(" ")[4])}
					{this.griditem("Venue:", this.props.location.venue)}
					{this.griditem("Pax:", this.props.location.pax)}

					{/* {this.griditem("Order ID:","test")}
                {this.griditem("Date:","test")}
                {this.griditem("Time:","test")}
                {this.griditem("Venue:","test")}
                {this.griditem("Unit Number:","test")}
                {this.griditem("Pax:", "test")} */}

					<br></br>
					<Divider variant="il" />
					<br></br>
					<Typography component="h5" variant="h5">
						Menu
					</Typography>
					<br></br>
					{this.renderMenu()}
					<br></br>

					<Grid container spacing={1}>
						<Grid container item xs={12} spacing={0}>
							<Button
								href={ROUTES.ORDER_FORM}
								color="secondary"
								fullWidth
								variant="contained"
							>
								Create New Order
							</Button>
						</Grid>
						<Grid container item xs={12} spacing={0}>
							<Button
								href={ROUTES.LANDING}
								color="primary"
								fullWidth
								variant="contained"
							>
								Home
							</Button>
						</Grid>
					</Grid>
				</Container>
			</div>
		);
	}
}

const PostOrderForm = withRouter(withFirebase(PostOrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(PostOrderForm);
