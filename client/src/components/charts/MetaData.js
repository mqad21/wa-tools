import React from "react";
import { Typography } from "@material-ui/core";

export default function MetaData(props) {
  const { data } = props;

  return (
    <React.Fragment>
      <Typography variant="body">Jumlah chat: {data.length}</Typography>
      <br />
      <Typography variant="body">
        Rentang waktu: {new Date(data[0].timestamp * 1000).toLocaleString()}
        {" - "}
        {new Date(data[data.length - 1].timestamp * 1000).toLocaleString()}
      </Typography>
    </React.Fragment>
  );
}
