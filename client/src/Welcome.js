import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import { useGlobal } from "reactn";
import { useCookies } from "react-cookie";

export default function Welcome(props) {
  const [, setValid] = useGlobal("valid");
  const [, setName] = useGlobal("name");
  const [, setCookie] = useCookies(["wa-tools"]);

  const responseGoogle = (response) => {
    if (!response.error) {
      const { name, email } = response.profileObj;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      const url = "https://api.mqad21.my.id/google.php";
      fetch(url, {
        method: "post",
        body: formData,
      });
      setName(name);
      const tomorrow = new Date(new Date());
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCookie("wa-tools", response.tokenId, { expires: tomorrow });
      setCookie("wa-tools-uname", name, { expires: tomorrow });
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <Grid container justify="center" alignItems="center" direction="column">
      <Grid item style={{ marginBottom: "3em" }}>
        <Typography style={{ color: "#fff" }} variant="h3">
          Whatsapp Tools
        </Typography>
        <Typography
          style={{
            color: "rgb(251, 188, 5)",
            width: "100%",
            textAlign: "center",
          }}
          variant="h5"
        >
          by{" "}
          <a
            style={{ textDecoration: "none", color: "rgb(251, 188, 5)" }}
            href="https://instagram.com/mqad21"
          >
            mqad21
          </a>
        </Typography>
      </Grid>
      <Grid item>
        <GoogleLogin
          clientId="832139506357-3i14nm2kmnsjr72q3h9kov707r5pod71.apps.googleusercontent.com"
          buttonText="Sign in with google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
          isSignedIn
        />
      </Grid>
    </Grid>
  );
}
