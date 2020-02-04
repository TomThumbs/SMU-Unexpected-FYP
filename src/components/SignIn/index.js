import React, { Component } from 'react';
import logo from './ffl_logo.png';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};


const SignInPage = () => (
  <div >
    <br></br><br></br>
    <h1><center><img src={logo} alt="logo" /></center></h1>
    <SignInForm />
  </div>
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.classes = { useStyles }
  }



  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    
    return (
      
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={this.classes.paper}>
          
          <Typography component="h1" variant="h4" align="center">
        </Typography>

        <form onSubmit={this.onSubmit}>
        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="email"
          value={email}
          label="Email Address"
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
          autoComplete="email"
          autoFocus
          
        />
        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
          label="Password"
        />
        
        <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

        <div><br/></div>
        <Button 
        disabled={isInvalid} 
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={this.classes.submit}>
          Sign In
        </Button>
        
        {error && <p>{error.message}</p>}
        <div><br/></div>

        <Grid container>
          <Grid item xs>
            <Link href="pw-forget" variant="body">
            Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="signup" variant="body2">
              Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage; 
export { SignInForm };


