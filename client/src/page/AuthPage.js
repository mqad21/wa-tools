import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import Loading from "../components/Loading";
import QRCode from "qrcode.react";
import { Redirect } from "react-router-dom";
import { socket } from "../shared/socketConfig";
import Error from "../components/Error";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "2em",
    padding: "4em",
    textAlign: "center",
  },
  text: {
    marginBottom: "2em",
  },
}));

const QrImage = (props) => {
  const { qr } = props;
  if (qr == null) return null;
  return <QRCode value={qr} size={200} />;
};

export default function Auth(props) {
  const classes = useStyles();
  const [qr, setQr] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [, setReconnect] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    getQr();
  }, []);

  const PROCESS_MESSAGE = {
    primary: "Sedang memproses...",
    secondary: "(Pastikan handphone anda terhubung ke internet)",
  };

  const handleReconnect = () => {
    setReconnect(true);
    getQr();
  };

  const getQr = () => {
    const session = localStorage.getItem("session_wa_tools");
    if (!started) {
      setStarted(true);
      socket.emit("start", session, (newSession) => {
        localStorage.setItem("session_wa_tools", newSession);
      });
      socket.on("fetch-qr", (qr) => {
        setReconnect(false);
        setError(null);
        setQr(qr);
      });
      socket.on("stop-qr", () => {
        setQr(null);
        setError(null);
        setReconnect(false);
        setLoggedIn(true);
      });
      socket.on("connect_error", () => {
        setError("Gagal terhubung ke server :(");
        setReconnect(false);
      });
      socket.on("fail", (err) => {
        setError("Gagal terhubung ke server " + err);
        setReconnect(false);
      });
    }
  };

  if (loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        {qr ? (
          <React.Fragment>
            <Typography variant="body" className={classes.text}>
              Silakan scan QR code di bawah ini menggunakan aplikasi WA
            </Typography>
            <QrImage qr={qr} />
          </React.Fragment>
        ) : null}
        {!qr ? <Loading loadingMessage={PROCESS_MESSAGE} /> : null}
      </Grid>

      <Grid
        item
        container
        direction="column"
        justify="center"
        alignContent="center"
        spacing={2}
      >
      </Grid>
    </Grid>
  );
}
