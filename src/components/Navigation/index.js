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
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SMART_HEATING}>Smart Heater</Link>
        </li>
        <li>
            <Link to={ROUTES.DELIVERY_SELECTION}>Make Delivery</Link>
        </li>
        <li>
            <Link to={ROUTES.ORDER_FORM}>Order Form</Link>
        </li>
        <li>
            <Link to={ROUTES.NEW_INGREDIENT}>Tag Ingredient</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul className="nav-links">
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);

export default Navigation;
