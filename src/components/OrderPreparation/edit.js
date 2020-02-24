import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import * as ROUTES from "../../constants/routes";
import { withAuthorization } from "../Session";

const useStyles = makeStyles(theme =>
	createStyles({
		// const useStyles = makeStyles({
		root: {
			flexGrow: 1
		},
		paper: {
			marginTop: theme.spacing(8),
			display: "flex",
			flexDirection: "column",
			maxWidth: 400,
			textAlign: "center"
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
	})
);

const INITIAL_STATE = {
	open: false,
	docID: "",
	orderID: "",
	completion: false,
	status: "",
};

class OrderPreparationEditBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id"));
		this.setState({
			orderID: urlId
		});	
	}

	onChange = event => {
		console.log([event.target.name], this.state.completion)
		if (this.state.completion === false) { 
			this.setState({
				[event.target.name]: true 
			}) 
		} else {
			this.setState({
				[event.target.name]: false 
			}) 
		}
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.orderID)
			.update({
				Status: "Order Complete"
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});
		this.handleClickOpen();
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleTimeline = () => {
		this.setState({
			open: false
		});
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.state.orderID,
			state: {
				orderID: this.state.orderID
			}
		});
	};

	renderBackButton() {
		return (
			<Link
				to={{
					pathname: ROUTES.ORDER_TIMELINE,
					search: "?id=" + this.state.orderID
				}}
			>
				<Button>Back</Button>
			</Link>
		);
	}

	render() {
		let isInvalid = this.state.completion === false
		return (
			<div className="body">
				<Container component="main" maxWidth="xs" className={this.classes.root}>
					{this.renderBackButton()}
					<Paper className={this.classes.paper}>
						<Typography>Confirm Completion</Typography>

						<FormControlLabel
							control={
							<Checkbox
								onChange={this.onChange}
								name="completion"
								value="true"
								color="primary"
							/>}
							label="The order has been successfully delivered!"
						/>

						<form onSubmit={this.onSubmit}>
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
						</form>
						<Dialog
							open={this.state.open}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{"Submission Notification"}
							</DialogTitle>
							<DialogContent dividers>
								<DialogContentText id="alert-dialog-description">
									Order Completed!
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleTimeline} color="primary" autoFocus>
									Back to Timeline
								</Button>
							</DialogActions>
						</Dialog>
					</Paper>
				</Container>
			</div>
		);
	}
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(OrderPreparationEdit);
