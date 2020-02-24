import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FileUploader from "react-firebase-file-uploader";

import { withAuthorization } from '../Session'

// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

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
	hands:false,
	workspace:false,
	image:"",
	imageURL:"",
	commencement: new Date()
};

class OrderPreparationSopBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE, docID: props.location.state.docID };
		this.classes = { useStyles };
	}

	componentDidMount() {
		let queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let urlId = Number(urlParams.get("id")); 

		this.setState({
			orderID: urlId 
		});
		
		let day = this.state.commencement.getDate()
		let month = Number(this.state.commencement.getMonth())+1
		let year = this.state.commencement.getFullYear()
		let hour = this.state.commencement.getHours()
		let minute = String(this.state.commencement.getMinutes())
		if (month.length === 1) {
			month = "0" + month
		}
		if (hour.length === 1) {
			hour = "0" + hour
		}
		if (minute.length === 1) {
			minute = "0" + minute
		}
		this.setState({commencement: day + "/" + month + "/" + year + " " + hour + ":" + minute})

		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.onSnapshot(doc => {
				let data = doc.data();
				this.setState({
					orderID: data.orderID,
					headchef: data.headchef,
					assistantA: data.assistantA,
					assistantB: data.assistantB
				});
			});
	}

	handleUploadSuccess = filename => {
		this.setState({
			image: filename,
		});

		this.props.firebase.stg
			.ref("kitchenHistory")
			.child(filename)
			.getDownloadURL()
			.then(url =>
				this.setState({
					imageURL: url
				})
			);
	};

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

	onSubmit = event => {
		this.props.firebase.fs
			.collection("Catering_orders")
			.doc(this.state.docID)
			.update({
				headchef: this.state.headchef,
				assistantA: this.state.assistantA,
				assistantB: this.state.assistantB,
				kitchenImageURL: this.state.imageURL,
				preparationCommencement: this.state.commencement,
			})
			.then(function() {
				console.log("Document successfully written!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});
		this.props.history.push({
			pathname: './order-preparation-post-sop',
			search: "?id=" + this.state.searchId,
			headchef: this.state.headchef,
			assistantA: this.state.assistantA,
			assistantB: this.state.assistantB,
			imageURL: this.state.imageURL,
			orderID: this.state.orderID,
			preparationCommencement: this.state.commencement,
		});
	};

	onBoxChange = event => {
			this.setState({
				[event.target.name]: true 
			}) 
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

  render() {
	let isInvalid = this.state.hands === false || this.state.workspace === false || this.state.imageURL.length === 0
    return (
      <div class="body">
      <Container component="main" maxWidth="xs" className={this.classes.root}>
        {this.renderBackButton()}
        <Paper className={this.classes.paper}>
          <Typography>Order Preparation SOP Agreement</Typography>
          <Typography>Order #{this.state.orderID}</Typography>

          {/* ---------- FORM ---------- */}
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="headchef"
              value={this.state.headchef}
              label="Head Chef"
              onChange={this.onChange}
              type="text"
              placeholder="Head Chef"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="assistantA"
              value={this.state.assistantA}
              label="Assistant A"
              onChange={this.onChange}
              type="text"
              placeholder="Assistant A"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="assistantB"
              value={this.state.assistantB}
              label="Assistant B"
              onChange={this.onChange}
              type="text"
              placeholder="Assistant B"
              autoFocus
            />
            <FormControlLabel
              control={<Checkbox name="hands" onChange={this.onBoxChange} value="remember" color="primary" />}
              label="Washed hands?"
            />
            <FormControlLabel
              control={<Checkbox name="workspace" onChange={this.onBoxChange} value="remember" color="primary" />}
              label="Use of Mask and gloves?"
            />
            <FormControlLabel
              control={<Checkbox name="workspace" onChange={this.onBoxChange} value="remember" color="primary" />}
              label="Clean workspace?"
            />
            <FormControlLabel
              control={<Checkbox name="workspace" onChange={this.onBoxChange} value="remember" color="primary" />}
              label="Clean kitchen tools?"
            />
            <p>Add photo here</p>

			<FileUploader
				accept="image/*"
				name="image"
				storageRef={this.props.firebase.stg.ref("kitchenHistory")}
				onUploadSuccess={this.handleUploadSuccess}
			/>

            <Button
			  disabled={isInvalid}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
      </div>
    );
  }
}

const OrderPreparationSop = withRouter(withFirebase(OrderPreparationSopBase));
const condition = authUser => !!authUser;

export default withAuthorization(condition) (OrderPreparationSop);
