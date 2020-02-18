import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div id='nav'>
        <AuthUserContext.Consumer>
            {authUser =>
            authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul className="nav-links">
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.SEARCH_ORDER}>Search Order</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.SMART_HEATING}>Smart Heater</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.DELIVERY_SELECTION}>Make Delivery</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.DISPLAY_ORDERS}>Display Orders</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.ORDER_FORM}>Order Form</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.NEW_INGREDIENT}>New Ingredient Form</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.DISPLAY_INGREDIENT}>Display Ingredient</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.DISH_TO_INGREDIENT_FORM}>Digital Recipe Form</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.COOKING_SELECTION}>Pre Cooking Ingredient Tag Form</Link>
        </li>
        <li className="nav-link">
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul className="nav-links">
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li className="nav-link">
            <Link className="navigation-link" to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);

export default Navigation;
