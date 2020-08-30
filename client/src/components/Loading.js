import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Typography, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "2em",
    textAlign: "center",
  },
}));

const Loading = (props) => {
  const { loadingMessage } = props;
  const classes = useStyles();

  if (loadingMessage == null) return null;
  return (
    <div className={classes.root}>
      <CircularProgress color="primary" />
      <Typography>{loadingMessage.primary}</Typography>
      <Typography variant="caption">{loadingMessage.secondary}</Typography>
    </div>
  );
};

export default Loading;
