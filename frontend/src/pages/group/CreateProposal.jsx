import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddManualTx from "./AddManualTx";

function CreateProposal() {
  const [type, setType] = React.useState(null);
  const params = useParams();
  
  const { policyAddress } = params;

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;

  return (
    <>
      <Typography
        gutterBottom
        mt={2}
        p={1}
        fontWeight={600}
        textAlign={"left"}
        variant="h6"
        color="text.primary"
      >
        Create Proposal
      </Typography>

      <Paper
        sx={{
          p: 2,
        }}
        elevation={0}
      >
        
        <AddManualTx
          address={policyAddress}
          chainInfo={chainInfo}
          handleCancel={() => setType(null)}
        />
      </Paper>
    </>
  );
}

export default CreateProposal;
