import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { Alert, Button, Typography } from "@mui/material";
import { Grant } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import React from "react";

interface FeegranterInfoProps {
  feegrant: Grant | undefined;
  onRemove: () => {};
}

export default function FeegranterInfo(props: FeegranterInfoProps) {
  return (
    <Alert
      sx={{
        textAlign: "left",
        m: 2,
      }}
      color="warning"
      variant="outlined"
      action={
        <Button
          color="inherit"
          size="small"
          sx={{
            margin: "auto",
            textTransform: "none",
          }}
          startIcon={<CloseOutlined />}
          onClick={() => props.onRemove()}
        >
          Remove Feegrant
        </Button>
      }
    >
      <Typography>
        Transaction fees will be deducted from{" "}
        <strong>{props.feegrant?.granter}</strong> account
      </Typography>
    </Alert>
  );
}
