import React from "react";
import { Typography } from "@material-ui/core";

const Download = () => {
  return (
    <Typography variant="caption" style={{ marginTop: ".5em" }}>
      Anda juga bisa mengunduh versi desktop{" "}
      <a
        href="https://s.id/wa-tools"
        target="_blank"
      >
        di sini.
      </a>
    </Typography>
  );
};

export default Download;
