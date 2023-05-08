import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";
import { getMainNetworks, getTestNetworks } from "../../utils/networks";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { setAuthzMode } from "../../features/authz/authzSlice";
import { useDispatch, useSelector } from "react-redux";

function ActiveProposals() {
  const chains = getMainNetworks();
  const testChains = getTestNetworks();
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const switchHandler = (event) => {
    setChecked(event.target.checked);
    if (checked) {
      dispatch(setAuthzMode(false));
    } else {
      dispatch(setAuthzMode(true));
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Typography sx={{ fontWeight: "500", color: "text.primary" }}>
          Authz
        </Typography>
        <Switch checked={checked} onChange={switchHandler} />
      </Box>
      {chains.map((key, index) => (
        <>
          {" "}
          <Proposals
            chainUrl={key.config.rest}
            chainName={key.config.chainName}
            chainLogo={key.logos.menu}
          />
        </>
      ))}
    </div>
  );
}

export default ActiveProposals;
