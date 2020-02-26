import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import "../../App.css";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
	searchId: ""
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
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

class SearchOrderBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	componentDidMount() {}

	onSubmit = event => {
		console.log(this.state);
		// const serch =
		this.props.history.push({
			pathname: ROUTES.ORDER_TIMELINE,
			search: "?id=" + this.state.searchId,
			state: {
				orderID: this.state.searchId
			}
		});
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		let isInvalid = this.state.searchId.length === 0;

		return (
			<div className="body">
				<Container component="main" maxWidth="xs">
					<form onSubmit={this.onSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							name="searchId"
							value={this.state.searchId}
							label="Search Order ID"
							onChange={this.onChange}
							type="string"
							placeholder="Order ID"
						/>
						<Button
							disabled={isInvalid}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							classes={this.classes.submit}
						>
							Search
						</Button>
					</form>
				</Container>
			</div>
		);
	}
}

const SearchOrder = withRouter(withFirebase(SearchOrderBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition)(SearchOrder);
