import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from '../Session'


import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
// import Paper from "@material-ui/core/Paper";
// import Button from "@material-ui/core/Button";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

// import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		maxWidth: 400,
		textAlign: "center"
		// margin: `${theme.spacing(1)}px auto`,
		// padding: theme.spacing(2),
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	text: {
		textAlign: "center"
	}
}));

const INITIAL_STATE = {
	docID: "",
	orderID: "",
	// statusList: ['Order Received', 'Preparation', 'Delivery', 'Service', 'Order Complete'],
	dateOnly: "",
	time: "",
	venue: "",
	pax: "",
	status: "",
	menu: []
};

class OrderServiceBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	componentDidMount() {}

  render() {
    return (
      <div class="body">
      <Container component="main" maxWidth="xs">
        <Grid container spaciing={3}>
          <Grid item xs={4}>Heater</Grid>
          <Grid item xs={4}>Heater</Grid>
          <Grid item xs={4}>Heater</Grid>

          <Grid item xs={4}>Heater</Grid>
          <Grid item xs={4}>Heater</Grid>
          <Grid item xs={4}>Heater</Grid>
        </Grid>
      </Container>
      </div>
    );
  }
}

const OrderService = compose(withRouter, withFirebase)(OrderServiceBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition) (OrderService);
