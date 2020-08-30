import React from "react";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

export default function ChartCard(props) {
  const { children, title } = props;

  return (
    <Grid item style={{ width: "calc(100% - 2em)", margin: ".5em 1em" }}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
}
