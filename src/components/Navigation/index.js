import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const Navigation = () => (
	<div id="nav">
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
			<Link className="navigation-link" to={ROUTES.LANDING}>
				Landing
			</Link>
		</li>
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.SEARCH_ORDER}>
				Search Order
			</Link>
		</li>
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.SMART_HEATING}>
				Heater IoT
			</Link>
		</li>
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.DELIVERY_SELECTION}>
				Delivery Selection
			</Link>
		</li>
		{/* <li className="nav-link">
<Link className="navigation-link" to={ROUTES.DISPLAY_ORDERS}>Display Orders</Link>
</li> */}
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.ORDER_FORM}>
				Create New Order
			</Link>
		</li>
		{/* <li className="nav-link">
			<Link className="navigation-link" to={ROUTES.NEW_INGREDIENT}>
				Tag New Ingredients
			</Link>
		</li> */}
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.ITEM_MANAGEMENT}>
				Item Management
			</Link>
		</li>
		{/* <li className="nav-link">
			<Link className="navigation-link" to={ROUTES.DISPLAY_INGREDIENT}>
				Check Ingredients
			</Link>
		</li> */}
		<li className="nav-link">
			<Link
				className="navigation-link"
				to={ROUTES.DISH_TO_INGREDIENT_FORM}
			>
				Recipe Creation
			</Link>
		</li>
		{/* <li className="nav-link">
<Link className="navigation-link" to={ROUTES.COOKING_SELECTION}>Cooking Tag Form</Link>
</li> */}
		<li className="button-link">
			<SignOutButton />
		</li>
	</ul>
);

const NavigationNonAuth = () => (
	<ul className="nav-links">
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.LANDING}>
				Landing
			</Link>
		</li>
		<li className="nav-link">
			<Link className="navigation-link" to={ROUTES.SIGN_IN}>
				Sign In
			</Link>
		</li>
	</ul>
);

export default Navigation;
