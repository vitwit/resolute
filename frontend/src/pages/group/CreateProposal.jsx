import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddManualTx from "./AddManualTx";

function CreateProposal() {
  const [type, setType] = React.useState(null);
  const { policyAddress } = useParams();

  const wallet = useSelector((state) => state.wallet);
  const chainInfo = wallet?.chainInfo;

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
