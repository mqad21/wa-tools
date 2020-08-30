import React from "react";
import "./App.css";
import Main from "./Main.js";
import { BrowserRouter as Router } from "react-router-dom";
import { setGlobal, useGlobal } from "reactn";
import { Typography } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import { useCookies } from "react-cookie";
import { socket } from "./shared/socketConfig";
import Loading from "./components/Loading";
import Welcome from "./Welcome";
import Container from "./components/Container";

socket.on("fail", (err) => {
  console.log(err);
});

setGlobal({
  loggedIn: false,
  targetPath: "/",
  isProcessing: true,
  log: [],
  name: null,
  valid: null,
  count: null,
  error: null,
});

const App = () => {
  const [valid, setValid] = useGlobal("valid");
  const [, setName] = useGlobal("name");
  const [cookies] = useCookies(["wa-tools"]);

  React.useEffect(() => {
    // setValid(false); //dev
    setValid(cookies["wa-tools"]);
    setName(cookies["wa-tools-uname"]);
  }, []);

  const Result = () => {
    if (valid === null)
      return (
        <Container>
          <Loading
            loadingMessage={{ primary: "Sedang memverifikasi Anda..." }}
          />
        </Container>
      );
    if (valid) {
      return <Main />;
    } else {
      return (
        <Container color="rgb(51, 103, 214)">
          <Welcome setValid={setValid} setName={setName} />
        </Container>
      );
    }
  };

  if (isMobile)
    return (
      <Container>
        <Typography>Bukanya pake laptop/pc ya</Typography>
      </Container>
    );
  return (
    <Router basename={"/wa-tools/"}>
      <Result />
    </Router>
  );
};

export default App;
