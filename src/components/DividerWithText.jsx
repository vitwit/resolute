import React from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

const DividerWithText = ({ children, ...props }) => (
  <Grid container alignItems="center" spacing={3} {...props}>
    <Grid item xs>
      <Divider />
    </Grid>
    <Grid item>{children}</Grid>
    <Grid item xs>
      <Divider />
    </Grid>
  </Grid>
);

export default DividerWithText;
