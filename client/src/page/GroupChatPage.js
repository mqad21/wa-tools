import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "emoji-mart/css/emoji-mart.css";
import { Grid } from "@material-ui/core";
import GroupChatResults from "../components/GroupChatResults";
import ChatSearch from "../components/ChatSearch";
import {socket} from "../shared/socketConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(5),
  },
}));

export default function GroupChatPage() {
  const classes = useStyles();
  const [group, setGroup] = React.useState();
  const [chats, setChats] = React.useState();

  const handleSubmit = (selectedGroup, limit) => {
    setChats(null);
    socket.emit(
      "request",
      {
        requestType: "GET_CHATS",
        payload: {
          id: selectedGroup.id,
          limit: limit,
        },
      },
      (response, error) => {
        if (error) {
          console.log(error);
          setChats([]);
        }
        setChats(response);
      }
    );
  };

  React.useEffect(() => {
    socket.emit(
      "request",
      {
        requestType: "GET_GROUPS",
      },
      (response, error) => {
        if (error) {
          console.log(error);
        }
        setGroup(response);
      }
    );
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container justify="center">
          <Grid item container direction="row" justify="center">
            <ChatSearch
              handleSubmit={handleSubmit}
              data={group}
              chats={chats}
            />
            {chats !== null && chats !== undefined ? (
              <GroupChatResults data={chats} />
            ) : null}
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}
