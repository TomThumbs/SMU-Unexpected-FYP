import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
	paper: {
		display: "flex",
		flexDirection: "column",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const PasswordForgetPage = () => (
	<Container component="main" maxWidth="xs">
		<Typography component="h1" variant="h4" gutterBottom>
					Reset Password
		</Typography>
		<PasswordForgetForm />
	</Container>
);
const INITIAL_STATE = {
	email: "",
	error: null,
};
class PasswordForgetFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}
	onSubmit = (event) => {
		event.preventDefault();

		const { email } = this.state;
		this.props.firebase
			.doPasswordReset(email)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
			})
			.catch((error) => {
				this.setState({ error });
			});
		this.props.history.push({
			pathname: ROUTES.LANDING,
		});
	};
	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	render() {
		const { email, error } = this.state;
		const isInvalid = email === "";
		return (
			<Paper>
				<Typography variant="body2" color="secondary" gutterBottom>
						A new password will be sent to your email. 
					</Typography>
				<form onSubmit={this.onSubmit}>
					{/* <input
						name="email"
						value={this.state.email}
						onChange={this.onChange}
						type="text"
						placeholder="Email Address"
					/> */}
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="email"
						value={this.state.email}
						label="Email Address"
						onChange={this.onChange}
						type="text"
						placeholder="Email Address"
						autoFocus
					/>
					{/* <button disabled={isInvalid} type="submit">
						Reset My Password
					</button> */}
					<div><br></br></div>
					<Button
						disabled={isInvalid}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={this.classes.submit}
					>
						Reset My Password
					</Button>
					{error && <p>{error.message}</p>}
				</form>
			</Paper>
		);
	}
}
const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
	</p>
);
export default PasswordForgetPage;
const PasswordForgetForm = withRouter(withFirebase(PasswordForgetFormBase));
export { PasswordForgetForm, PasswordForgetLink };
