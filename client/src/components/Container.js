import React from "react";
import { Grid } from "@material-ui/core";

const Container = (props) => {
  const { color } = props;

  return (
    <Grid
      style={{ backgroundColor: color || "#fff", height: "100vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <Grid item>{props.children}</Grid>
    </Grid>
  );
};

export default Container;
