import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";


const Message = (props) => {
  const { type, message } = props;
  const useStyles = makeStyles(() => ({
    message: {
      color: type === "error" ? "red" : "green",
      marginTop: "2em",
      textAlign: "center",
      width: "100%"
    },
  }));
  const classes = useStyles();
  if (message === "") return null;
  return (
    <Typography variant="caption" className={classes.message}>
      {message}
    </Typography>
  );
};

export default Message;
