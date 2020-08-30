import React from "react";
import {
  Button,
  CircularProgress,
  FormGroup,
  makeStyles,
  TextField,
  FormControl,
} from "@material-ui/core";
import AutoCompleteSingleSelect from "./AutoCompleteSingleSelect";

const useStyles = makeStyles((theme) => ({
  marginHorizontal: {
    margin: ".5em",
  },
}));

export default function ChatSearch(props) {
  const classes = useStyles();
  const { data, handleSubmit, chats } = props;
  const [selectedGroup, setSelectedGroup] = React.useState();
  const [limit, setLimit] = React.useState();

  const handleSelect = (e, v) => {
    setSelectedGroup(v);
  };

  const handleLimit = (e) => {
    setLimit(e.target.value);
  };

  return (
    <React.Fragment>
      <FormGroup row>
        <FormControl className={classes.marginHorizontal}>
          <AutoCompleteSingleSelect
            className={classes.marginHorizontal}
            placeholder={!data ? "Memuat chat..." : "Pilih chat"}
            data={data} 
            showLoading={!data}
            disabled={!data || chats === null}
            handleSelect={handleSelect}
          />
        </FormControl>
        <FormControl className={classes.marginHorizontal}>
          <TextField
            style={{ maxWidth: "200px" }}
            placeholder="Jumlah Chat"
            helperText="Kosongkan jika ingin mengambil semua chat"
            type="number"
            variant="outlined"
            onInput={handleLimit}
            disabled={!data || chats === null}
          />
        </FormControl>
        <FormControl className={classes.marginHorizontal}>
          <Button
            size="large"
            onClick={() => handleSubmit(selectedGroup, limit)}
            variant="contained"
            disabled={chats === null || !selectedGroup}
            color="primary"
          >
            {chats === null ? <CircularProgress size={30} /> : "Submit"}
          </Button>
        </FormControl>
      </FormGroup>
    </React.Fragment>
  );
}
