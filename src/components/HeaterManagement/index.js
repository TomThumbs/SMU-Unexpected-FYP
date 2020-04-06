import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		// maxWidth: 400,
		textAlign: "center",
		// margin: `${theme.spacing(1)}px auto`,
		height: 240,
		width: 400,
		padding: theme.spacing(2),
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	text: {
		textAlign: "center",
	},
}));

const INITIAL_STATE = {
	heaters: [],
	heatersID: [],
	done: false,
};

class HeaterManagementBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...INITIAL_STATE,
		};
		this.classes = { useStyles };
	}

	componentDidMount() {
		this.props.firebase.fs
			.collection("IoTHeaters")
			.orderBy("ID", "asc")
			.onSnapshot((snapshot) => {
				let changes = snapshot.docChanges();
				changes.forEach((change) => {
					let heaterID = change.doc.data().ID;
					// this.setState({
					// 	[heaterID]: {
					// 		orderID: change.doc.data().orderID,
					// 		status: change.doc.data().status,
					// 	},
					// });
					if (change.type === "added") {
						this.setState((prevState) => ({
							heaters: [
								...prevState.heaters,
								[
									change.doc.data().orderID,
									change.doc.data().status,
									change.doc.id,
								],
							],
							heatersID: [...prevState.heatersID, heaterID],
						}));
					}
					if (change.type === "modified") {
						let idx = change.doc.data().ID - 1;
						let heaters = this.state.heaters;
						heaters[idx] = [
							change.doc.data().orderID,
							change.doc.data().status,
							change.doc.id,
						];
						this.setState({
							heaters: heaters
						})
					}
				});
				this.setState({ done: true });
			});
	}

	onSubmit = (idx) => (event) => {
		event.preventDefault();

		this.props.firebase.fs
			.collection("IoTHeaters")
			.doc(this.state.heaters[idx][2])
			.update({
				status: "Unused",
				orderID: "Unused",
			});
	};

	// releaseHeater = idx => {
	// 	let docID = this.state.heaters[idx][2]
	// 	this.props.firebase.fs.collection("IoTHeaters").doc(docID).update({
	// 		status: "Unused",
	// 		orderID: "Unused",
	// 	});
	// }

	renderHeaters() {
		let result = [];
		this.state.heatersID.forEach((heaterID, idx) => {
			result.push(
				<Grid item xs={4} key={idx}>
					<Paper variant="outlined">
						<Typography variant="caption">Heater: {heaterID}</Typography>
						<br />
						<Typography variant="caption">
							OrderID: {this.state.heaters[idx][0]}
						</Typography>
						<br />
						<Typography variant="caption">
							Status: {this.state.heaters[idx][1]}
						</Typography>
						<form onSubmit={this.onSubmit(idx)}>
							<Button
								type="submit"
								// onClick={this.releaseHeater(idx)}
								fullWidth
								variant="contained"
								color="primary"
							>
								Release
							</Button>
						</form>
					</Paper>
				</Grid>
			);
		});
		return result;
	}

	render() {
		console.log(this.state);
		return (
			<Container component="main" maxWidth="sm">
				<Typography gutterBottom variant="h4">
					Heater Management
				</Typography>
				<Paper>
					<Grid container justify="center" spacing={2}>
						{this.state.done && this.renderHeaters()}
					</Grid>

					<br></br>
					<Grid container spacing={1}>
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
				</Paper>
			</Container>
		);
	}
}

const HeaterManagement = compose(
	withRouter,
	withFirebase
)(HeaterManagementBase);
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(HeaterManagement);
