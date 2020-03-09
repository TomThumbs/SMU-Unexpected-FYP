import React from 'react';
import {
  BrowserRouter as Router ,
  Route
} from 'react-router-dom';

import * as ROUTES from './constants/routes';
import './App.css';

// ---------- BASIC ---------- 
import Navigation from './components/Navigation'
import LandingPage from './components/Landing'
import SignUpPage from './components/SignUp'
import SignInPage from './components/SignIn'
import HomePage from './components/Home'
// import DeliveryForm from './components/DeliveryForm'
// import PostDeliveryForm from './components/PostDeliveryForm'

// ---------- ORDER FORM ---------- 
import OrderForm from './components/OrderForm'
import PostOrderForm from './components/PostOrderForm'
// import DeliverySelection from './components/DeliverySelection'

// ---------- ITEM MANAGEMENT ---------- 
import ItemManagementPage from './components/ItemManagementPage'
import { NewBasicIngredient, NewComplexIngredient } from './components/NewIngredient'
import DisplayIngredient from './components/DisplayIngredient'

import DisplayOrders from './components/DisplayOrders'

// ---------- SERARCH FOR ORDER TIMELINE---------- 
import SearchOrder from './components/SearchOrder'
import DisplayOrderTimeline from './components/DisplayOrderTimeline'
import OrderReceived from './components/OrderReceived'
import { OrderPreparation, OrderPreparationEdit, OrderPreparationSop, OrderPreparationPostSop } from './components/OrderPreparation'
import { OrderDelivery, PostDeliveryForm } from './components/OrderDelivery'
import { OrderService, OrderServiceRead } from './components/OrderService'
import { OrderCompletion, FinalOverview } from './components/OrderComplete'

import DishToIngredientForm from './components/DigitalRecipie'
import { withAuthentication } from './components/Session';
import CookingSelection from './components/CookingSelection';
import CookingForm from './components/CookingForm'

// import SmartHeaterDisplay from './views/smartHeater'
import IoTHeater from './components/IoTHeater'

// function App() {
const App = () => (
  <div className="App">
    <header className="App-header">
      <Router>
        <Navigation />

        {/* ---------- LANDING PAGE ---------- */}
        <Route exact path={ROUTES.LANDING} component={LandingPage} />

        {/* ---------- LOGIN ---------- */}
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />

        {/* ---------- HOME PAGE ---------- */}
        <Route path={ROUTES.HOME} component={HomePage} />

        {/* ---------- SMART HEATING ---------- */}
        <Route path={ROUTES.SMART_HEATING} component={IoTHeater} />

        {/* ---------- ITEM MANAGEMENT PAGE ---------- */}
        <Route path={ROUTES.ITEM_MANAGEMENT} component={ItemManagementPage} />

        {/* ---------- ADD A NEW INGREDIENT ---------- */}
        <Route path={ROUTES.NEW_INGREDIENT_BASIC} component={NewBasicIngredient} />
        <Route path={ROUTES.NEW_INGREDIENT_COMPLEX} component={NewComplexIngredient} />
        <Route path={ROUTES.DISPLAY_INGREDIENT} component={DisplayIngredient} />

        {/* ---------- ADD NEW ORDER ---------- */}
        <Route path={ROUTES.ORDER_FORM} component={OrderForm} />
        <Route path={ROUTES.POST_ORDER_FORM} component={PostOrderForm} />

        {/* ---------- ADD DELIVERY FORM ---------- */}
        <Route path={ROUTES.ORDER_DELIVERY} component={OrderDelivery} />
        <Route path={ROUTES.POST_DELIVERY_FORM} component={PostDeliveryForm} />
        {/* <Route path={ROUTES.DELIVERY_SELECTION} component={DeliverySelection} /> */}

        {/* ---------- FIND EXISTING ORDER ---------- */}
        <Route path={ROUTES.SEARCH_ORDER} component={SearchOrder} />
        <Route path={ROUTES.ORDER_TIMELINE} component={DisplayOrderTimeline}/>
        <Route path={ROUTES.ORDER_RECEIVED} component={OrderReceived}/>
        <Route path={ROUTES.ORDER_PREPARATION} component={OrderPreparation}/>
        <Route path={ROUTES.ORDER_PREPARATION_EDIT} component={OrderPreparationEdit}/>
        <Route path={ROUTES.ORDER_PREPARATION_SOP} component={OrderPreparationSop}/>
        <Route path={ROUTES.ORDER_PREPARATION_POST_SOP} component={OrderPreparationPostSop}/>
        <Route path={ROUTES.ORDER_SERVICE_EDIT} component={OrderService}/>
        <Route path={ROUTES.ORDER_SERVICE} component={OrderServiceRead}/>
        <Route path={ROUTES.ORDER_COMPLETE} component={OrderCompletion}/>
        <Route path={ROUTES.FINAL_OVERVIEW} component={FinalOverview}/>
        
        <Route path={ROUTES.DISPLAY_ORDERS} component={DisplayOrders} />
        <Route path={ROUTES.DISH_TO_INGREDIENT_FORM} component={DishToIngredientForm}/>
        <Route path={ROUTES.COOKING_SELECTION} component={CookingSelection}/>
        <Route path={ROUTES.COOKING_FORM} component={CookingForm}/>

      </Router>
    </header>
  </div>
);

export default withAuthentication(App);
