import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { Alert, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getICNSName } from "../features/common/commonSlice";

export default function FeegranterInfo(props) {
  const dispatch = useDispatch();
  const icnsNames = useSelector((state) => state.common.icnsNames);

  const [showAddress, setShowAddress] = useState(false);

  const fetchName = (address) => {
    if (!icnsNames?.[address]) {
      dispatch(
        getICNSName({
          address: address,
        })
      );
    }
    return icnsNames?.[address]?.name;
  };

  const address = props.feegrant?.granter;
  const name = fetchName(address);

  const toggleAddress = () => {
    setShowAddress((showAddress) => !showAddress);
  };

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
        <strong onClick={toggleAddress} style={{ cursor: "pointer" }}>
          {showAddress ? address : name || address}
        </strong>{" "}
        account
      </Typography>
    </Alert>
  );
}
