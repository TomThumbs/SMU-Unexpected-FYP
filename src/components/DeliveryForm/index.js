import React, { Component } from "react";
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import FileUploader from "react-firebase-file-uploader";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import { withAuthorization } from "../Session";

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
	oID:""
};

class DeliveryFormBase extends Component {
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
		console.log(urlId);
		this.setState({
			orderID: urlId
		});

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
					oID: doc.data().orderID
				});
				this.props.firebase.fs
					.collection("Customers")
					.doc(this.state.name)
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
				Driver: this.state.driver
			}); //UPDATE FIRESTORE
		// this.props.firebase.fs.collection('Catering_orders').doc(this.state.catering_event_doc).update({ TruckImgURL: this.state.imageURL });

		this.setState({ imageURL: "" });

		this.props.history.push({
			pathname: './post-delivery-form',
			orderid: this.state.oID,
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
				<h4>
					<font color="#e91e63">
						Please check all 4 checkboxes and upload a picture of
						the truck.
					</font>
				</h4>
			);
		}
	}

	render() {
		// console.log(typeof this.state.menu)
		return (
			<Container component="main" maxWidth="sm">
				<div class="body">
					<h1>Customer {this.state.cID}</h1>
					<React.Fragment>
						<Typography variant="h5" gutterBottom>
							Event Details
						</Typography>

						<Grid container alignItems="center">
							<Grid item xs>
								Venue:
							</Grid>
							<Grid item>
								<b>{this.state.venue}</b>
							</Grid>
						</Grid>

						<Grid container alignItems="center">
							<Grid item xs>
								Pax:
							</Grid>
							<Grid item>
								<b>{this.state.pax}</b>
							</Grid>
						</Grid>

						<Grid container alignItems="center">
							<Grid item xs>
								Customer Name:
							</Grid>
							<Grid item>
								<b>{this.state.name}</b>
							</Grid>
						</Grid>

						<Grid container alignItems="center">
							<Grid item xs>
								Customer HP:
							</Grid>
							<Grid item>
								<b>{this.state.contact}</b>{" "}
							</Grid>
						</Grid>

						<br />
						<Divider variant="li" />
						<br />

						<TextField
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

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.cleanReady}
									onChange={this.handleChange("cleanReady")}
									color="secondary"
									name="cleanReady"
									value="cleanReady"
								/>
							}
							// <Checkbox checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />
							label="Food securely packed?"
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.allItems}
									onChange={this.handleChange("allItems")}
									color="secondary"
									name="allItems"
									value="allItems"
								/>
							}
							label="Vehicle Clean?"
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.foodWrap}
									onChange={this.handleChange("foodWrap")}
									color="secondary"
									name="foodWrap"
									value="foodWrap"
								/>
							}
							label="No strong odors?"
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.decor}
									onChange={this.handleChange("decor")}
									color="secondary"
									name="foodWrap"
									value="foodWrap"
								/>
							}
							label="Buffet decor loaded?"
						/>
						<br />
						<br />
						<Divider variant="li" />

						<h4>
							Attach Image
						</h4>
					</React.Fragment>

					{/* <label> Progress: {this.props.imageURL}</label> */}
					{/* <p>{this.state.progress}</p> */}

					<FileUploader
						accept="image/*"
						name="image"
						storageRef={this.props.firebase.stg.ref("truckHistory")}
						onUploadStart={this.handleUploadStart}
						onUploadSuccess={this.handleUploadSuccess}
						onProgress={this.handleProgress}
					/>
					<div>{this.renderSubmit()}</div>
				</div>
			</Container>
		);
	}
}

const DeliveryForm = withRouter(withFirebase(DeliveryFormBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(DeliveryForm);

//this.state.docID
