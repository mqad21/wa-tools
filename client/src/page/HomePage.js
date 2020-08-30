import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@material-ui/core";
import { Send, Chat, Group } from "@material-ui/icons";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: "#fff",
  },
  text: {
    width: "100%",
    marginBottom: "2em",
    textAlign: "center",
  },
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <Grid item>
      <List component="nav" className={classes.list}>
        <ListItem button component={Link} to="/scheduler">
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          <ListItemText primary="Kirim Pesan Terjadwal" />
        </ListItem>
        <ListItem button component={Link} to="/private-chat">
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="Analisis Data Chat Pribadi" />
        </ListItem>
        <ListItem button component={Link} to="/group-chat">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Analisis Data Chat Group" />
        </ListItem>
      </List>
    </Grid>
  );
}
