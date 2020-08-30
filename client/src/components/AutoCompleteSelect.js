import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AutoCompleteSelect(props) {
  const { data, label } = props;

  return (
    <Autocomplete
      options={data}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
}
