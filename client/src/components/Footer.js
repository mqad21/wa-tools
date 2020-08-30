import React from "react";
import { Grid, Typography, Link } from "@material-ui/core";
import { FavoriteOutlined } from "@material-ui/icons";
import Download from "./Download";

const Footer = (props) => {
  return (
    <Grid
      item
      style={{
        position: "fixed",
        bottom: 0,
        padding: "1em",
        width: "100vw",
        textAlign: "center",
        backgroundColor: "white",
        zIndex: 1000,
      }}
    >
      <Typography
        variant="caption"
        style={{
          textAlign: "center",
          fontStyle: "italic",
          marginTop: "2em",
        }}
      >
        Jika telah selesai menggunakan, mohon webnya ditutup. Penggunaan web ini
        dibatasi hanya untuk 3 orang secara bersamaan. Terima kasih.
      </Typography>
      <br />
      <Download />
      <br />
      <Typography
        align="center"
        variant="caption"
        style={{ width: "90%", marginTop: ".5em" }}
      >
        Made with <FavoriteOutlined style={{ fontSize: "1em" }} /> by{" "}
        <Link href="https://instagram.com/mqad21">mqad21</Link>
      </Typography>
    </Grid>
  );
};

export default Footer;
