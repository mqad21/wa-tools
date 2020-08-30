import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { ArrowBack, ExitToApp } from "@material-ui/icons";
import { useGlobal } from "reactn";
import { useGoogleLogout } from "react-google-login";
import { useLocation, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { socket } from "../shared/socketConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const [name] = useGlobal("name");
  const [, setValid] = useGlobal("valid");
  const location = useLocation();
  const [, , removeCookie] = useCookies(["wa-tools"]);
  const { signOut } = useGoogleLogout({
    onFailure: () => {},
    clientId:
      "832139506357-3i14nm2kmnsjr72q3h9kov707r5pod71.apps.googleusercontent.com",
    onLogoutSuccess: () => {},
  });

  const handleLogout = () => {
    removeCookie("wa-tools");
    removeCookie("wa-tools-uname");
    setValid(false);
    signOut();
    setTimeout(() => {
      localStorage.removeItem("session_wa_tools");
    }, 1000);
    socket.emit("leave");
  };

  const NO_BACK_PAGES = ["/auth", "/"];

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        {!NO_BACK_PAGES.includes(location.pathname) ? (
          <IconButton
            component={Link}
            to="/"
            className={classes.menuButton}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <ArrowBack />
          </IconButton>
        ) : null}
        <Typography className={classes.title} variant="body">
          Halo, {name}
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout}
          size="small"
          startIcon={<ExitToApp />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
