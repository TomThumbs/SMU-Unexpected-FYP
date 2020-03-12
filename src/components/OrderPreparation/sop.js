import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FileUploader from "react-firebase-file-uploader";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import { withAuthorization } from "../Session";

import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		marginTop: theme.spacing(50),
		display: "flex",
		flexDirection: "column",
		maxWidth: 400,
		textAlign: "center",
		margin: "1em",
		padding: theme.spacing(2)
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	text: {
		textAlign: "center"
	}
}));

const INITIAL_STATE = {
	docID: "",
	orderID: "",
	hands: false,
	workspace: false,
	image: "",
	imageURL: "",
	commencement: new Date(),
	StatusDates: [],
	headchef: "",
	assistantA: "",
	assistantB: "",
	mask: false,
	tools: false
};

class OrderPreparationSopBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	renderSubmit() {
		if (
			// this.state.hands === true &&
			// this.state.imageURL.length !== 0 &&
			// this.state.workspace === true &&
			// this.state.mask === true &&
			// this.state.tools === true &&
			// this.state.headchef.length !== 0 
			// this.state.assistantA.length !== 0 &&
			this.state.assistantB.length !== 0 
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
					Please ensure that you have adhered to and completed the
					checklist requirements. Please also upload a picture of the
					state of the kitchen.
				</Typography>
			);
		}
	}

	componentDidMount() {
		// let allStatus = ""
		// console.log(this.props.location.state.docID)
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));

		this.setState({
			orderID: urlId
		});

		let day = String(this.state.commencement.getDate());
		let month = Number(this.state.commencement.getMonth()) + 1;
		let year = String(this.state.commencement.getFullYear());
		let hour = String(this.state.commencement.getHours());
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

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.onSnapshot(doc => {
				let data = doc.data();
				this.setState({
					orderID: data.orderID,
					headchef: data.headchef,
					assistantA: data.assistantA,
					assistantB: data.assistantB,
					StatusDates: data.StatusDates.concat(
						this.state.commencement
					)
				});
			});
	}

	handleUploadSuccess = filename => {
		this.setState({
			image: filename
		});

		this.props.firebase.stg
			.ref("kitchenHistory")
			.child(filename)
			.getDownloadURL()
			.then(url =>
				this.setState({
					imageURL: url
				})
			);
	};

	renderBackButton() {
		return (
			<Button
				variant="outlined"
				fullWidth
				component={RouterLink}
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				Back
			</Button>
		);
	}

	onSubmit = event => {
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				sop: true,
				headchef: this.state.headchef,
				assistantA: this.state.assistantA,
				assistantB: this.state.assistantB,
				kitchenImageURL: this.state.imageURL,
				StatusDates: this.state.StatusDates
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});
		this.props.history.push({
			pathname: "./order-preparation-post-sop",
			search: "?id=" + this.state.orderID,
			headchef: this.state.headchef,
			assistantA: this.state.assistantA,
			assistantB: this.state.assistantB,
			imageURL: this.state.imageURL,
			orderID: this.state.orderID,
			preparationCommencement: this.state.commencement
		});
	};

	onBoxChange = event => {
		console.log(event.target.name)
		this.setState({
			[event.target.name]: true
		});
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		// let isInvalid =
		// 	this.state.hands === false ||
		// 	this.state.workspace === false ||
		// 	this.state.imageURL.length === 0;

		return (
			<Container component="main" maxWidth="xs">
				<Typography gutterBottom variant="h4">
					Kitchen Declaration
				</Typography>
				<Paper className={this.classes.paper}>
					<Typography variant="h6" gutterBottom color="primary">
						Order Number: {this.state.orderID}
					</Typography>

					{/* ---------- FORM ---------- */}

					<form onSubmit={this.onSubmit}>
						<React.Fragment>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										name="headchef"
										value={this.state.headchef}
										label="Head Chef"
										onChange={this.onChange}
										type="text"
										placeholder="Head Chef"
										 
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										name="assistantA"
										value={this.state.assistantA}
										label="Assistant A"
										onChange={this.onChange}
										type="text"
										placeholder="Assistant A"
										 
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										name="assistantB"
										value={this.state.assistantB}
										label="Assistant B"
										onChange={this.onChange}
										type="text"
										placeholder="Assistant B"
										 
									/>
								</Grid>

								<Grid item xs={12}>
									<Typography variant="h6" gutterBottom>
										Checklist
									</Typography>
								</Grid>
							</Grid>

							<Grid container xs={12}>
								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												name="hands"
												onChange={this.onBoxChange}
												value="remember"
												color="primary"
											/>
										}
										label="Washed hands?"
									/>
								</Grid>

								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												name="mask"
												onChange={this.onBoxChange}
												value="remember"
												color="primary"
											/>
										}
										label="Use of Mask and gloves?"
									/>
								</Grid>

								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												name="workspace"
												onChange={this.onBoxChange}
												value="remember"
												color="primary"
											/>
										}
										label="Clean workspace?"
									/>
								</Grid>
								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												name="tools"
												onChange={this.onBoxChange}
												value="remember"
												color="primary"
											/>
										}
										label="Clean kitchen tools?"
									/>
								</Grid>
							</Grid>
							<p>
								<Divider variant="li" />
							</p>

							<Typography variant="h6" gutterBottom>
								Attach Image of Kitchen
							</Typography>
						</React.Fragment>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<FileUploader
									accept="image/*"
									name="image"
									storageRef={this.props.firebase.stg.ref(
										"kitchenHistory"
									)}
									onUploadSuccess={this.handleUploadSuccess}
								/>
							</Grid>

							<Grid item xs={12}>
								{this.renderSubmit()}
							</Grid>

							<Grid item xs={12}>
								<Button
									variant="outlined"
									fullWidth
									component={RouterLink}
									to={{
										pathname: ROUTES.ORDER_TIMELINE,
										search: "?id=" + this.state.orderID
									}}
								>
									Back to Timeline
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant="outlined"
									color="primary"
									fullWidth
									component={RouterLink}
									to={ROUTES.LANDING}
								>
									Home
								</Button>
							</Grid>
						</Grid>
						{/* <Button
							disabled={isInvalid}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={this.classes.submit}
						>
							Submit
						</Button> */}
					</form>
				</Paper>
			</Container>
		);
	}
}

const OrderPreparationSop = withRouter(withFirebase(OrderPreparationSopBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(OrderPreparationSop);
