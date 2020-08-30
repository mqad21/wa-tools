/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, InputAdornment } from "@material-ui/core";

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

export default function AutoCompleteSingleSelect(props) {
  const classes = useStyles();
  const { placeholder, data, handleSelect, disabled, showLoading } = props;

  return (
    <Autocomplete
      style={{ width: 300 }}
      options={data}
      classes={{
        option: classes.option,
      }}
      disabled={disabled}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(option) => <span>{option.name}</span>}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Chat"
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: showLoading ? (
              <>
                <InputAdornment position="start">
                  <CircularProgress size={25} />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ) : null,
          }}
        />
      )}
    />
  );
}
