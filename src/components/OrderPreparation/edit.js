import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import * as ROUTES from "../../constants/routes";

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

class OrderPreparationEditBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
    this.classes = { useStyles };
  }

  componentDidMount() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let urlId = Number(urlParams.get("id"));
    // console.log(urlId)
    this.setState({
      orderID: urlId
    });

    // ---------- RETRIEVE CATERING ORDER ----------
    console.log("Retreving Catering Order");
    this.props.firebase.fs
      .collection("Catering_orders")
      .where("orderID", "==", urlId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          this.setState({
            docID: doc.id,
            dateOnly: data.DateOnly,
            time: data.Time,
            venue: data.venue,
            pax: Number(data.Pax),
            status: data.Status,
            menu: Array.from(new Set(data.Menu))
          });
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    // ---------- RETRIEVE MENU INGREDIENTS ----------
    console.log("Retreving Menu Ingredients");
    this.props.firebase.fs
      .collection("Menu")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          this.setState({
            [data.name]: data.Ingredients
          });
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  onSubmit = event => {
    event.preventDefault();

    // ingredientTagsUsed is the equivalent of the TextareaAutosize. For whatever text in there, it splits by comma
   // gets the RFID details and appends it to a new variable called ingredientsUsed
  // then it writes to the db, under the name of Ingredients_Used.
    let ingredientsTempList = this.state.ingredientTagsUsed.split(",")
    let ingredientsTempListLength = ingredientsTempList.length  
    for (var i = 0; i < ingredientsTempListLength; i++) {
      //Get
      this.props.firebase.fs.collection('Ingredient_RFID').doc(ingredientsTempList[i]).get().then(doc=>{
        this.setState((prevstate) => ({
          ingredientsUsed: [...prevstate.ingredientsUsed, doc.data().Name + ": " + doc.data().Date_of_expiry + ", " + ingredientsTempList[i]]
        }));
        //Write
       // Why this writing code is being initiated many times in this for loop is because ingredientsUsed becomes blank
      // after this for loop is done. its weird. if this code is outside the for loop, itll write blank to the db.
        this.props.firebase.fs.collection('Catering_orders').doc(this.props.location.docID).update({
          Ingredients_Used: this.state.ingredientsUsed
        })
      })
    }


    console.log(this.state.docID)
    this.props.firebase.fs.collection('Catering_orders').doc(this.state.docID).update({
      Status: 'Preparation'
    }).then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  renderMenuItem(item) {
    const ingredients = this.state[item];
    // console.log(ingredient)
    let menu = [];
    if (ingredients !== undefined) {
      ingredients.forEach((ingt, id) => {
        menu.push(
          <div>
            {/* <Grid item xs={6}> */}
            <Typography key={id}>{ingt}</Typography>
            {/* </Grid> */}
            {/* <Grid item xs={6}> */}
            {/* <Typography>Insert checkbox </Typography> */}
            {/* </Grid> */}
          </div>
        );
      });
    }
    return menu;
  }

  renderMenu() {
    let list = [];
    this.state.menu.forEach((item, id) => {
      list.push(
        <div key={id}>
          <Paper className={this.classes.paper}>
            <Typography variant="h6">{item}</Typography>
            {this.renderMenuItem(item)}
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={3}
              placeholder="Minimum 3 rows"
            />
          </Paper>
        </div>
      );
    });
    return list;
  }

  renderBackButton() {
    return (
      <Link
        to={{
          pathname: ROUTES.ORDER_TIMELINE,
          search: "?id=" + this.state.orderID
        }}
      >
        <Button>Back</Button>
      </Link>
    );
  }

  render() {
    // console.log(this.state)
    return (
      <Container component="main" maxWidth="xs" className={this.classes.root}>
        {this.renderBackButton()}
        <Paper className={this.classes.paper}>
          <Typography>Order Preparation Edit</Typography>

          {/* <Grid container spacing={3}> */}
          <form onSubmit={this.onSubmit}>
            {this.renderMenu()}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Submit
            </Button>
          </form>
          {/* </Grid> */}
        </Paper>
      </Container>
    );
  }
}

const OrderPreparationEdit = withRouter(withFirebase(OrderPreparationEditBase));

export default OrderPreparationEdit;
