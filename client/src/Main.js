import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HomePage from "./page/HomePage";
import AuthPage from "./page/AuthPage";
import SchedulerPage from "./page/SchedulerPage";
import GroupChatPage from "./page/GroupChatPage";
import { Switch, Route, Redirect } from "react-router-dom";
import { useGlobal } from "reactn";
import PrivateChatPage from "./page/PrivateChatPage";
import Footer from "./components/Footer";
import TopBar from "./components/TopBar";
import Container from "./components/Container";
import Error from "./components/Error";
import { MAX_CONNECTED,URL, socket } from "./shared/socketConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#F5F5F5",
  },
  container: {
    minHeight: "calc(100vh - 72px)",
    maxWidth: "800px",
    marginBottom: "72px",
  },
}));

const connect = ({ setReconnect, setCount, setError }) => {
  if (setReconnect) setReconnect(true);
  fetch(URL + "/count")
    .then((response) => response.json())
    .then((response) => {
      const count = parseInt(response.count);
      setCount(count);
      if (count < MAX_CONNECTED) {
        socket.connect();
      }
      if (setReconnect) setReconnect(false);
      setError(null);
    })
    .catch((err) => {
      console.log(err);
      setError(true);
      if (setReconnect) setReconnect(false);
    });
};

export default function Main() {
  const classes = useStyles();
  const [loggedIn] = useGlobal("loggedIn");
  const [count, setCount] = useGlobal("count");
  const [error, setError] = useGlobal("error");
  const [, setValid] = useGlobal("valid");
  const [reconnect, setReconnect] = React.useState();

  const handleConnect = () => {
    connect({ setReconnect, setCount, setError });
  };

  React.useEffect(() => {
    connect({ setCount, setError });
    socket.on("kick", () => {
      socket.disconnect();
      console.log("kicked");
      setValid(false);
    });
    socket.on("connect_error", () => {
      setError(true);
    });
    socket.on("clear", () => {
      console.log("cleaned");
      setError(true);
    });
    socket.on("disconnect", (reason) => {
      console.log("disconnect", reason);
      setError(true);
    });
    window.onbeforeunload = (e) => {
      e.preventDefault();
      socket.emit("leave");
    };
  });

  if (count >= MAX_CONNECTED || error) {
    return (
      <Container>
        <Error error={error} action={handleConnect} reconnect={reconnect} />
      </Container>
    );
  }
  return (
    <div className={classes.root}>
      {!loggedIn ? <Redirect to="/auth" /> : null}
      <Grid container justify="center" alignContent="center">
        <Grid
          item
          justify="center"
          alignContent="center"
          container
          className={classes.container}
        >
          <TopBar />
          <Grid
            container
            lg={8}
            justify="center"
            alignContent="center"
            style={{ flexBasis: "100%", maxWidth: "100%", minHeight: "400px" }}
          >
            <Paper style={{ width: "100%", height: "100%" }} elevation={2}>
              <Grid
                item
                container
                justify="center"
                alignContent="center"
                style={{ height: "100%" }}
              >
                <Switch>
                  <Route exact path="/">
                    <HomePage />
                  </Route>
                  <Route path="/auth">
                    <AuthPage />
                  </Route>
                  <Route exact path="/scheduler">
                    <SchedulerPage />
                  </Route>
                  <Route exact path="/group-chat">
                    <GroupChatPage />
                  </Route>
                  <Route exact path="/private-chat">
                    <PrivateChatPage />
                  </Route>
                  <Redirect to="/" />
                </Switch>
              </Grid>
            </Paper>
          </Grid>
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
}
