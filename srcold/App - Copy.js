import React, { Component } from 'react';
import { 
  BrowserRouter as Router ,
  Route
} from 'react-router-dom';

import * as ROUTES from './constants/routes';
import './App.css';

import Navigation from './components/Navigation'
import LandingPage from './components/Landing'
import SignUpPage from './components/SignUp'
import SignInPage from './components/SignIn'
import HomePage from './components/Home'
import DeliveryForm from './components/DeliveryForm'
import OrderForm from './components/OrderForm'

import { withAuthentication } from './components/Session';

import SmartHeaterDisplay from './views/smartHeater'

// function App() {
const App = () => (
  <div className="App">
    <header className="App-header">
      <Router>
        <Navigation />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SMART_HEATING} component={SmartHeaterDisplay} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.DELIVERY_FORM} component={DeliveryForm} />
        <Route path={ROUTES.ORDER_FORM} component={OrderForm} />
      </Router>
    </header>
  </div>
);

export default withAuthentication(App);
