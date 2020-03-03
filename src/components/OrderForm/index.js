import React, { Component } from "react";

import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";

import { withAuthorization } from "../Session";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker
} from "@material-ui/pickers";

const INITIAL_STATE = {
	orderID: 0,
	orderiddoc: "",
	date: "",
	starttime: "",
	endtime: "",
	venue: "",
	pax: 30,
	hour: "",
	minute: "",
	custname: "",
	custcontact: "",
	custemail: "",
	custcompany: "",
	custID: 0,
	custref: "",
	selectedmenu: [],
	finalmenu: [],
	remarks: "",
	commencement: new Date()
};

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	}
}));

class OrderFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let day = this.state.commencement.getDate();
		let month = Number(this.state.commencement.getMonth()) + 1;
		let year = this.state.commencement.getFullYear();
		let hour = this.state.commencement.getHours();
		let minute = String(this.state.commencement.getMinutes());
		if (month.length === 1) {
			month = "0" + month;
		} 
		
		if (hour.length === 1) {
			hour = "0" + hour;
		}
		if (minute.length === 1) {
			minute = "0" + minute;
		}
		this.setState({
			commencement:
				day + "/" + month + "/" + year + " " + hour + ":" + minute
		});

		// Detect latest order ID
		this.props.firebase.fs
			.collection("Catering_orders")
			.orderBy("orderID", "desc")
			.limit(1)
			.onSnapshot(snapshot => {
				let changes = snapshot.docChanges();
				changes.forEach(change => {
					let orderidnum = Number(change.doc.data().orderID);
					this.setState({
						orderID: orderidnum + 1,
						orderiddoc: change.doc.id
					});
				});
			});

		//get latest customer ID
		this.props.firebase.fs
			.collection("Customers")
			.doc("Counter")
			.get()
			.then(docu => {
				this.setState({
					custID: Number(docu.data().ID) + 1
				});
			});

		// Get list of menu items
		this.props.firebase.fs
			.collection("Menu")
			.orderBy("Type")
			.onSnapshot(snapshot => {
				let changes = snapshot.docChanges();
				changes.forEach(change => {
					let dishname = change.doc.data().name;
					let dishtype = change.doc.data().Type;
					this.setState(prevstate => ({
						selectedmenu: [
							...prevstate.selectedmenu,
							{
								dish: dishname,
								type: dishtype,
								selected: "false"
							}
						]
					}));
				});
			});
	}

	// onSubmit = event => {
	// 	event.preventDefault();

	// 	let finalmenu = []

	// 	this.state.selectedmenu.forEach(item => {
	// 		let dishname = item.dish + " checkbox";
	// 		if (dishname in this.state) {
	// 			// console.log(dishname);
	// 			// console.log(dishname in this.state);
	// 			if (this.state[dishname] === true) {
	// 				// console.log(this.state[dishname]);
	// 				// this.setState(prevstate => ({
	// 				// 	finalmenu: [...prevstate.finalmenu, item.dish]
	// 				// }));
	// 				finalmenu.push(item.dish)
	// 			}
	// 		}
	// 	});

	// 	console.log(finalmenu)
	// };

	onSubmit = event => {
		event.preventDefault();

		let strhour = String(this.state.hour);
		let strmonth = Number(this.state.date.getMonth()) + 1;
		let strmin = "";
		if (this.state.minute.length === 1) {
			strmin = "0" + String(this.state.minute);
		} else {
			strmin = String(this.state.minute);
		}

		let strtime = "";
		if (strhour.length === 1) {
			strtime = "0" + String(this.state.hour) + strmin;
		} else {
			strtime = String(this.state.hour) + strmin;
		}
		let strDate =
			this.state.date.getFullYear() +
			"-" +
			strmonth +
			"-" +
			this.state.date.getDate();
		let submitDate = new Date(
			this.state.date.getFullYear(),
			this.state.date.getMonth(),
			this.state.date.getDate(),
			this.state.hour,
			this.state.minute,
			0
		);
		let strSubmitDate = String(submitDate);

    let strMonth = Number(new Date().getMonth()) + 1;

    // let uniqueMenu = Array.from(new Set(this.state.finalmenu))
    // console.log(this.state.finalmenu, "ppppppppppppppp", Array.from(new Set(this.state.finalmenu)))
    this.props.firebase.fs.collection("Catering_orders").add({
      Customer: "",
      Status: "Order Received",
      Date: submitDate,
      DateOnly: strDate,
      // DeliveryCheck: false,
      Menu: Array.from(new Set(this.state.finalmenu)),
      Pax: Number(this.state.pax),
      Time: strtime,
      // TruckImgUrl: '',
      venue: this.state.venue,
      orderID: this.state.orderID,
      sop: false,
      HeatersUsed: heatersUsed,
      StatusDates: [this.state.commencement],
      Created_On: this.state.commencement
  
    });
    
		let heatersUsed = {};

		finalmenu.forEach(dish => {
			heatersUsed = { ...heatersUsed, [dish]: "unallocated" };
		});

		// let strMonth = Number(new Date().getMonth()) + 1;
		this.props.firebase.fs.collection("Catering_orders").add({
			Customer: "",
			Status: "Order Received",
			Date: submitDate,
			DateOnly: strDate,
			// DeliveryCheck: false,
			Menu: finalmenu,
			Pax: Number(this.state.pax),
			Time: strtime,
			// TruckImgUrl: '',
			venue: this.state.venue,
			orderID: this.state.orderID,
			sop: false,
			HeatersUsed: heatersUsed,
			StatusDates: [this.state.commencement],
			Created_On: this.state.commencement,
			remarks: this.state.remarks,
		});

		let notCreated = true;

		this.props.firebase.fs
			.collection("Customers")
			.where("Email", "==", this.state.custemail)
			.get()
			.then(snap => {
				snap.forEach(doc => {
					if (doc.exists) {
						this.setState({ custExists: true });

						// console.log('Customer exists')
						this.setState({ custref: "Customers/" + doc.id });
						let dbcustref = this.props.firebase.fs.doc(
							"Customers/" + doc.id
						);

						this.props.firebase.fs
							.collection("Catering_orders")
							.where("orderID", "==", this.state.orderID)
							.onSnapshot(snapshot => {
								let changes = snapshot.docChanges();
								changes.forEach(change => {
									this.props.firebase.fs
										.doc("Catering_orders/" + change.doc.id)
										.update({ Customer: dbcustref });
									// console.log('linked catering order to customer')
									notCreated = false;
								});
							});
					}
				});
			});
		// console.log(notCreated)
		if (notCreated) {
			// console.log('Customer to be created')
			let custDocName = "Customer" + String(this.state.custID);
			console.log("custid" + this.state.custID + " --- " + custDocName);
			this.props.firebase.fs
				.collection("Customers")
				.doc(custDocName)
				.set({
					Company: this.state.custcompany,
					CustomerID: this.state.custID,
					Email: this.state.custemail,
					HP: this.state.custcontact,
					Name: this.state.custname
				});
			this.props.firebase.fs
				.collection("Customers")
				.doc("Counter")
				.update({ ID: this.state.custID });
			let dbcustref = this.props.firebase.fs.doc(
				"Customers/Customer" + this.state.custID
			);
			this.props.firebase.fs
				.collection("Catering_orders")
				.where("orderID", "==", this.state.orderID)
				.onSnapshot(snapshot => {
					let changes = snapshot.docChanges();
					changes.forEach(change => {
						this.props.firebase.fs
							.doc("Catering_orders/" + change.doc.id)
							.update({ Customer: dbcustref });
						// console.log('linked catering order to customer')
					});
				});
		}

		let nPax = Number(this.state.pax);

		this.props.history.push({
			pathname: "./post-order-form",
			orderID: this.state.orderID,
			date: strSubmitDate,
			venue: this.state.venue,
			pax: nPax,
			Menu: finalmenu,
			remarks: this.state.remarks,
		});
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onMenuChange = event => {
		// const dishname = event.target.value;

		// if(this.state.finalmenu.includes(dishname) === false){
		//   this.setState(prevstate => ({
		//     finalmenu: [...prevstate.finalmenu, dishname]
		//   }));
		// }

		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name + " checkbox"]: value
		});

		console.log(this.state);

		// this.setState(prevstate => ({
		// 	finalmenu: [...prevstate.finalmenu, dishname]
		// }));
		// console.log(event.target.name + ": " + event.target.value)
	};

	handleDateChange = event => {
		this.setState({
			date: event
		});
		// console.log(this.state.date)
	};

	handleTimeChange = time => {
		this.setState({
			starttime: time,
			hour: time.getHours(),
			minute: time.getMinutes()
		});
		// console.log(this.state.starttime)
	};

	createTextField = (name, temp, label, placeholder) => {
		return (
			<TextField
				margin="densed"
				fullWidth
				name={name}
				value={temp}
				label={label}
				onChange={this.onChange}
				type="text"
				placeholder={placeholder}
			/>
		);
	};

	today = new Date();
	renderMenu = () => {
		let listofmenu = [];
		let dishtype = [];

		this.state.selectedmenu.forEach(item => {
			if (dishtype.includes(item.type) === false) {
				dishtype.push(item.type);
				listofmenu.push(<p margin-block-end="2em" key={item.type}><b>{item.type}</b></p>);
			}

			listofmenu.push(
				<div key={item.dish}>
					<FormControlLabel
						control={
							<Checkbox
								// checked={item.selected}
								onChange={this.onMenuChange}
								name={item.dish}
								value={item.dish}
								color="primary"
							/>
						}
						label={item.dish}
					/>
					<br />
				</div>
			);
		});

		return listofmenu;
	};

	render() {
		let isInvalid =
			this.state.date.length !== 0 &&
			this.state.starttime.length !== 0 &&
			this.state.venue.length !== 0 &&
			this.state.pax.length >= 30 &&
			this.state.custname.length !== 0 &&
			this.state.custcontact.length !== 0 &&
			this.state.custemail.length !== 0 &&
			this.state.custcompany.length !== 0;

		return (
			<Container component="main" maxWidth="sm">
				<Typography variant="h4"  gutterBottom>Order Form</Typography>
				<Paper>
					<form onSubmit={this.onSubmit}>
						<TextField
							variant="filled"
							margin="dense"
							fullWidth
							name="orderID"
							value={this.state.orderID}
							label="Order ID"
							placeholder="Order ID"
							autoFocus
							InputProps={{
								readOnly: true
							}}
						/>
						<div>
							<br></br>
						</div>
						<Grid container spacing={3}>
						
							<MuiPickersUtilsProvider utils={DateFnsUtils} >
							<Grid item xs={6} >
								<KeyboardDatePicker
									variant="inline"
									InputLabelProps={{ shrink: true }}
									fullWidth
									margin="densed"
									
									label="Date:"
									format="dd/MM/yyyy"
									minDate={this.today}
									id="date-picker-inline"
									value={this.state.date}
									onChange={this.handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change date"
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<KeyboardTimePicker
									InputLabelProps={{ shrink: true }}
						
									id="time-picker"
									fullWidth
									margin="densed"
									label="Time:"
									value={this.state.starttime}
									onChange={this.handleTimeChange}
									KeyboardButtonProps={{
										"aria-label": "change time"
									}}
								/>
							</Grid>
							</MuiPickersUtilsProvider>
						
						
							<Grid item xs={6} >
								{/* Customer Name */}
								{this.createTextField(
									"custname",
									this.state.custname,
									"Customer Name:",
									"Customer Name"
								)}
							</Grid>

							<Grid item xs={6} >
								{/* Customer Company */}
								{this.createTextField(
									"custcompany",
									this.state.custcompany,
									"Customer Company:",
									"Customer Company"
								)}
							</Grid>
							
							<Grid item xs={6} >
								{/* Customer Email */}
								{this.createTextField(
									"custemail",
									this.state.custemail,
									"Customer Email:",
									"Customer Email"
								)}
							</Grid>
							
							<Grid item xs={6} >
								{/* Customer HP */}
								{this.createTextField(
									"custcontact",
									this.state.custcontact,
									"Customer Phone Number:",
									"Customer Phone Number"
								)}
							</Grid>
							
							<Grid item xs={6} >
								{/* Postal Code */}
								{this.createTextField(
									"venue",
									this.state.venue,
									"Venue:",
									"Venue"
								)}
							</Grid>

							<Grid item xs={6} >
							<TextField
								margin="densedl"
								id="standard-number"
								fullWidth
								name="pax"
								value={this.state.pax}
								label="Number of people"
								type="number"
								onChange={this.onChange}
								InputLabelProps={{
									shrink: true
								}}
								inputProps={{ min: 30 }}
							/>
							</Grid>
							
							<p><Divider variant="il" /></p>

							
							<Grid item xs={12} >
								<Typography component="h5" variant="h5">Menu</Typography>

							{/* Display Menu */}
							{this.renderMenu()}
							</Grid>
							
							<Grid item xs={12} >
							{/* Remarks */}
							{this.createTextField(
								"remarks",
								this.state.remarks,
								"Remarks:",
								"Remarks"
							)}
							</Grid>
							
							<Grid item xs={12} >
							<Button
								disabled={isInvalid}
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={this.classes.submit}
							>
								Submit
							</Button>
							</Grid>
						</Grid>
					</form>
				</Paper>
			
			</Container>
		);
	}
}

const OrderForm = withRouter(withFirebase(OrderFormBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderForm);
