import React, { Component } from "react";
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import FileUploader from "react-firebase-file-uploader";
import { Link as RouterLink } from 'react-router-dom';

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	}
}));

const INITIAL_STATE = {
	image: "",
	imageURL: "",
	progress: 0,
	catering_event_doc: "",
	cleanReady: "",
	allItems: "",
	foodWrap: "",
	date: "",
	starttime: "",
	venue: "",
	pax: 0,
	name: "",
	contact: "",
	email: "",
	strDate: "",
	menu: "",
	cID: "",
	decor:"",
	driver:"",
	oID:"",
	commencement: new Date(),
	StatusDates:""
};

class OrderDeliveryBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}
	componentDidMount() {
		// ---------- GET ORDER ID FROM URL ----------
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		// console.log(urlId);
		this.setState({
			orderID: urlId
		});

		this.props.firebase.fs
		.collection("Catering_orders")
		.doc(this.state.docID)
		.get()
		.then(doc => {
			if (doc.data().Status === "Delivery" || doc.data().Status === "Event in Progress" || doc.data().Status === "Order Completed") {
				this.props.history.push({
					pathname: ROUTES.POST_DELIVERY_FORM,
					orderID: this.state.orderID,
					driver: doc.data().Driver,
					url: doc.data().TruckImgURL
				  })
			}
		})

		let day = this.state.commencement.getDate()
		let month = Number(this.state.commencement.getMonth())+1
		let year = this.state.commencement.getFullYear()
		let hour = this.state.commencement.getHours()
		let minute = String(this.state.commencement.getMinutes())
		if (month.length === 1) {
			month = "0" + month
			}
		if (hour.length === 1) {
			hour = "0" + hour
			}
		if (minute.length === 1) {
			 minute = "0" + minute
			}
		this.setState({commencement: day + "/" + month + "/" + year + " " + hour + ":" + minute})

		// ---------- GET ORDER DETAILS ----------
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.get()
			.then(doc => {
				// console.log(doc.data().orderID)
				this.setState({
					// catering_event_doc: doc.id,
					date: String(doc.data().Date.toDate()).split("GMT")[0],
					menu: doc.data().Menu,
					venue: doc.data().venue,
					pax: doc.data().Pax,
					name: doc.data().Customer.id,
					oID: doc.data().orderID,
					// StatusDates: doc.data().StatusDates.concat(this.state.commencement)
				});
				this.props.firebase.fs
					.collection("Customers")
					.doc(doc.data().Customer.id)
					.get()
					.then(docu => {
						this.setState({
							contact: docu.data().HP,
							name: docu.data().Name,
							cID: docu.data().CustomerID
						});
					});
			});

		let temp_date = String(this.state.date);
		console.log(this.state.date);
		this.setState({
			strDate: temp_date.split("GMT")[0]
		});
	}

	onSubmit = event => {
		// this.props.firebase.fs.collection('Catering_orders').doc(this.state.catering_event_doc).update({ DeliveryCheck: true }); //UPDATE FIRESTORE
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				DeliveryCheck: true,
				TruckImgURL: this.state.imageURL,
				Status: "Delivery",
				Driver: this.state.driver,
				StatusDates: this.state.StatusDates
			}); //UPDATE FIRESTORE
		// this.props.firebase.fs.collection('Catering_orders').doc(this.state.catering_event_doc).update({ TruckImgURL: this.state.imageURL });

		this.setState({ imageURL: "" });

		this.props.history.push({
			pathname: ROUTES.POST_DELIVERY_FORM,
			orderID: this.state.oID,
			driver: this.state.driver,
			url: this.state.imageURL
		  })
	};

	handleUploadStart = () => {
		this.setState({
			progress: 0
		});
	};

	handleUploadSuccess = filename => {
		this.setState({
			image: filename,
			progress: 100
		});

		this.props.firebase.stg
			.ref("truckHistory")
			.child(filename)
			.getDownloadURL()
			.then(url =>
				this.setState({
					imageURL: url
				})
			);
	};

	handleProgress = progress => {
		this.setState({
			progress: progress,
			imageURL: ""
		});
	};

	handleChange = name => event => {
		this.setState({ ...this.props, [name]: event.target.checked });
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	renderSubmit() {
		if (
			this.state.cleanReady === true &&
			this.state.allItems === true &&
			this.state.foodWrap === true &&
			this.state.decor === true &&
			this.state.imageURL.length !== 0 &&
			this.state.driver.length !== 0
		) {
			return (
				<form onSubmit={this.onSubmit}>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={this.classes.submit}
					>
						Submit
					</Button>
				</form>
			);
		} else {
			return (
				<Typography variant="subtitle2" color="secondary">
						Please check all 4 checkboxes and upload a picture of the truck.
				</Typography>
			);
		}
	}

	griditem(title,info){
		return (
			<Grid container> 
				<Grid item xs={6}>{title}</Grid>
				<Grid item xs={6}><b>{info}</b></Grid>
			</Grid>
		)
	}


	render() {
		// console.log(typeof this.state.menu)
		return (
			<Container component="main" maxWidth="xs">
				<Typography variant="h4" gutterBottom>Delivery Form</Typography>
				<Paper>
					<React.Fragment>
					
						<Typography variant="h6" gutterBottom>Order #{this.state.oID}</Typography>
						
						<Typography variant="body1">
							{this.griditem("Venue:",this.state.venue)}
							{this.griditem("Pax:",this.state.pax)}
							{this.griditem("Customer Name:",this.state.custName)}
							{this.griditem("Customer HP No.:",this.state.custHp)}
							
							
							<TextField
							variant="outlined"
							margin="normal"
							id="standard-number"
							required
							fullWidth
							name="driver"
							value={this.state.driver}
							label="Enter Driver Name"
							type="text"
							onChange={this.onChange}
							/>

							<Typography variant="h6" gutterBottom>
								Checklist
							</Typography>
							
							<Grid container xs={12}>
								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.cleanReady}
												onChange={this.handleChange("cleanReady")}
												color="primary"
												name="cleanReady"
												value="cleanReady"
											/>
										}
										// <Checkbox checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />
										label="Food securely packed?"
									/>
								</Grid>

								<Grid item xs>			
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.allItems}
												onChange={this.handleChange("allItems")}
												color="primary"
												name="allItems"
												value="allItems"
											/>
										}
										label="Vehicle Clean?"
									/>
								</Grid>
								
								<Grid item xs={12}>		
								<FormControlLabel
									control={
										<Checkbox
											checked={this.state.foodWrap}
											onChange={this.handleChange("foodWrap")}
											color="primary"
											name="foodWrap"
											value="foodWrap"
										/>
									}
									label="No strong odors?"
								/>
								</Grid>
								
								
								<Grid item xs>	
								<FormControlLabel
									control={
										<Checkbox
											checked={this.state.decor}
											onChange={this.handleChange("decor")}
											color="primary"
											name="foodWrap"
											value="foodWrap"
										/>
									}
									label="Buffet decor loaded?"
								/>
								</Grid>
							
							</Grid>
							<p><Divider variant="li" /></p>
							
							
							<Typography variant="h6" gutterBottom>Attach Image of Truck</Typography>

							</Typography>
					</React.Fragment>

					<Grid container spacing={1}>	
						<Grid item xs={12}>			
							<FileUploader
								accept="image/*"
								name="image"
								storageRef={this.props.firebase.stg.ref("truckHistory")}
								onUploadStart={this.handleUploadStart}
								onUploadSuccess={this.handleUploadSuccess}
								onProgress={this.handleProgress}
							/>
						</Grid>
					
						<Grid item xs={12}>
							{this.renderSubmit()}
						</Grid>
						
						<Grid item xs={12}>
							<Button
								variant="outlined"
								fullWidth
								component={RouterLink} to={{
								pathname: ROUTES.ORDER_TIMELINE,
								search: "?id=" + this.state.orderID
							}}>Back to Timeline
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								component={RouterLink} 
								to={ROUTES.LANDING}
								>Home
							</Button>
						</Grid>
					</Grid>
				</Paper>			
			</Container>
		);
	}
}

const OrderDelivery = withRouter(withFirebase(OrderDeliveryBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderDelivery);

//this.state.docID
