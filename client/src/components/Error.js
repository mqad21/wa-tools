import React from "react";
import { Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import Download from "./Download";

const Error = (props) => {
  const { error, action, reconnect } = props;

  return (
    <React.Fragment>
      {!reconnect ? (
        <Grid item container direction="column" justify="center" alignContent="center">
          <Grid item>
            <Typography variant="body">
              {error
                ? "Gagal terhubung ke server."
                : "Maaf, jumlah online user telah mencapai batas."}
            </Typography>
            <Typography variant="body"> Silakan coba lagi nanti.</Typography>
            <br />
          </Grid>
          <Grid item container justify="center">
            <Download style={{width:'100%'}} />
          </Grid>
        </Grid>
      ) : null}
      <Grid item container justify="center" alignContent="center">
        <Button
          style={{ marginTop: "2em" }}
          color="primary"
          variant="contained"
          onClick={action}
          disabled={reconnect}
        >
          {reconnect === true ? (
            <CircularProgress color="primary" size={25} />
          ) : (
            "Coba lagi"
          )}
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default Error;
