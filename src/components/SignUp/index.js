import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column"
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const SignUpPage = () => (
	
		<SignUpForm />
	
);

const INITIAL_STATE = {
	username: "",
	email: "",
	passwordOne: "",
	passwordTwo: "",
	error: null
};

class SignUpFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	onSubmit = event => {
		const { email, passwordOne } = this.state;
		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				this.props.firebase.fs
					.collection("Users")
					.doc(authUser.user.uid)
					.set({
						email: this.state.email,
						name: this.state.username
					});

				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.LANDING);
			})
			.catch(error => {
				this.setState({ error });
			});
		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error,
			verify
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === "" ||
			email === "" ||
			username === "" ||
			verify !== "55555";

		// console.log(this.state);
		return (
			<Container component="main" maxWidth="xs">
				<Typography component="h1" variant="h4" gutterBottom>
					Sign Up
				</Typography>
				<Paper>
					<Grid container spacing={12}>
						<Grid item xs></Grid>
					</Grid>

					<form onSubmit={this.onSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="username"
							value={username}
							onChange={this.onChange}
							type="text"
							placeholder="Full Name"
							label="Full Name"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="email"
							value={email}
							onChange={this.onChange}
							type="text"
							placeholder="Email Address"
							label="Email Address"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="passwordOne"
							value={passwordOne}
							onChange={this.onChange}
							type="password"
							placeholder="Password"
							label="Password"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="passwordTwo"
							value={passwordTwo}
							onChange={this.onChange}
							type="password"
							placeholder="Confirm Password"
							label="Confirm Password"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="verify"
							value={this.state.verify}
							onChange={this.onChange}
							type="text"
							placeholder="Verification Code"
							label="Verification Code"
						/>
						<br></br>
						<br></br>
						<Button
							type="submit"
							disabled={isInvalid}
							fullWidth
							variant="contained"
							color="primary"
						>
							Sign Up
						</Button>
						{error && <p>{error.message}</p>}
					</form>
				</Paper>
			</Container>
		);
	}
}

const SignUpLink = () => (
	<p>
		Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	</p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
