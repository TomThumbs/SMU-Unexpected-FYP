import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Link, withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";

import * as ROUTES from "../../constants/routes";

const images = [
	{
		url: "./fruit.png",
		title: "Tag New Ingredients",
		width: "40%"
	},
	{
		url: "./cook.png",
		title: "Tag Ingredients To Order",
		width: "30%"
	},
	{
		url: "./barcode.png",
		title: "Check Ingredient",
		width: "30%"
	}
];

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		minWidth: 300,
		width: "100%"
	},
	image: {
		position: "relative",
		height: 200,
		[theme.breakpoints.down("xs")]: {
			width: "100% !important", // Overrides inline-style
			height: 100
		},
		"&:hover, &$focusVisible": {
			zIndex: 1,
			"& $imageBackdrop": {
				opacity: 0.15
			},
			"& $imageMarked": {
				opacity: 0
			},
			"& $imageTitle": {
				border: "4px solid currentColor"
			}
		}
	},
	focusVisible: {},
	imageButton: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: theme.palette.common.white
	},
	imageSrc: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundSize: "cover",
		backgroundPosition: "center 40%"
	},
	imageBackdrop: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create("opacity")
	},
	imageTitle: {
		position: "relative",
		padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(
			1
		) + 6}px`
	},
	imageMarked: {
		height: 3,
		width: 18,
		backgroundColor: theme.palette.common.white,
		position: "absolute",
		bottom: -2,
		left: "calc(50% - 9px)",
		transition: theme.transitions.create("opacity")
	}
}));

const INITIAL_STATE = {};

class ItemManagementPageBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.classes = { useStyles };
	}

	onClick = event => {
		let trigger = event.target.value;
		console.log(trigger);
		// if(index === 0){
		//   this.props.history.push({
		//     pathname: ROUTES.LANDING
		//   });
		//   console.log("The link was clicked 0.");
		// }
		switch (Number(trigger)) {
			case 0:
				this.props.history.push({
					pathname: ROUTES.LANDING
				});
				console.log("The link was clicked 0.");
				break;
			case 1:
				this.props.history.push({
					pathname: ROUTES.LANDING
				});
				console.log("The link was clicked 1.");
				break;
			case 2:
				this.props.history.push({
					pathname: ROUTES.LANDING
				});
				console.log("The link was clicked 2.");
				break;
		}
	};

	renderButtons(image, index) {
		console.log(typeof index);
		return (
			// <Button value={index} onClick={this.onClick}>
			//   {image.title}
			// </Button>
			<Grid item xs={4}>
        <Paper className={this.classes.Paper}>
        <ButtonBase
					focusRipple
					key={image.title}
					className={this.classes.image}
					focusVisibleClassName={this.classes.focusVisible}
					style={{
						width: image.width
					}}
					onClick={this.onClick}
					value={index}
					type="button"
				>
					{/* <span
					className={this.classes.imageSrc}
					style={{
						backgroundImage: `url(${image.url})`
					}}
				/>
				<span className={this.classes.imageBackdrop} />
				<span className={this.classes.imageButton}> */}
					{/* <Typography
						component="span"
						variant="subtitle1"
						color="inherit"
						className={this.classes.imageTitle}
					> */}
					{image.title}
					{/* <span className={this.classes.imageMarked} />
					</Typography> */}
					{/* </span> */}
				</ButtonBase>
        </Paper>
			</Grid>
		);
	}

	render() {
		return (
			// <p>Hi</p>
			<Container
				component="main"
				maxWidth="xs"
				className={this.classes.root}
			>
				<CssBaseline />
				<Grid container spacing={3}>
				{images.map((image, index) => this.renderButtons(image, index))}
				</Grid>
			</Container>
		);
	}
}

const ItemManagementPage = withRouter(withFirebase(ItemManagementPageBase));

export default ItemManagementPage;
