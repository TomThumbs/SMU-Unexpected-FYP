import React from 'react';
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
import PostDeliveryForm from './components/PostDeliveryForm'
import OrderForm from './components/OrderForm'
import PostOrderForm from './components/PostOrderForm'
import DeliverySelection from './components/DeliverySelection'
import NewIngredient from './components/NewIngredient'
import DisplayOrders from './components/DisplayOrders'
import SearchOrder from './components/SearchOrder'
import DisplayOrderTimeline from './components/DisplayOrderTimeline'
import OrderReceived from './components/OrderReceived'
import { OrderPreparation , OrderPreparationEdit } from './components/OrderPreparation'
import DishToIngredientForm from './components/DishToIngredientForm'
import { withAuthentication } from './components/Session';
import CookingSelection from './components/CookingSelection';
import CookingForm from './components/CookingForm'

import SmartHeaterDisplay from './views/smartHeater'

// function App() {
const App = () => (
  <div className="App">
    <header className="App-header">
      <Router>
        <Navigation />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.HOME} component={HomePage} />

        <Route path={ROUTES.SMART_HEATING} component={SmartHeaterDisplay} />

        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />

        <Route path={ROUTES.DELIVERY_FORM} component={DeliveryForm} />
        <Route path={ROUTES.POST_DELIVERY_FORM} component={PostDeliveryForm} />
        <Route path={ROUTES.DELIVERY_SELECTION} component={DeliverySelection} />

        <Route path={ROUTES.POST_ORDER_FORM} component={PostOrderForm} />
        <Route path={ROUTES.ORDER_FORM} component={OrderForm} />

        <Route path={ROUTES.NEW_INGREDIENT} component={NewIngredient} />
        <Route path={ROUTES.DISPLAY_ORDERS} component={DisplayOrders} />

        <Route path={ROUTES.SEARCH_ORDER} component={SearchOrder} />
        <Route path={ROUTES.ORDER_TIMELINE} component={DisplayOrderTimeline}/>
        <Route path={ROUTES.ORDER_RECEIVED} component={OrderReceived}/>
        <Route path={ROUTES.ORDER_PREPARATION} component={OrderPreparation}/>
        <Route path={ROUTES.ORDER_PREPARATION_EDIT} component={OrderPreparationEdit}/>

        <Route path={ROUTES.DISH_TO_INGREDIENT_FORM} component={DishToIngredientForm}/>
        <Route path={ROUTES.COOKING_SELECTION} component={CookingSelection}/>
        <Route path={ROUTES.COOKING_FORM} component={CookingForm}/>

      </Router>
    </header>
  </div>
);

export default withAuthentication(App);
