import { fromBase64 } from "@cosmjs/encoding";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  StargateClient,
  SigningStargateClient,
  makeMultisignedTx,
} from "@cosmjs/stargate";
import { useDispatch, useSelector } from "react-redux";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { setError } from "../../features/common/commonSlice";
import {
  resetUpdateTxnState,
  updateTxn,
} from "../../features/multisig/multisigSlice";

export default function BroadcastTx({ tx, signatures, multisigAccount }) {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const updateTxnRes = useSelector((state) => state.multisig.updateTxn);

  useEffect(() => {
    if (updateTxnRes.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: updateTxnRes.message,
        })
      );
    }
  }, [updateTxnRes]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateTxnState());
    };
  }, []);

  const broadcastTxn = async () => {
    setLoad(true);
    try {
      const client = await SigningStargateClient.connect(
        chainInfo?.config?.rpc
      );

      const bodyBytes = fromBase64(
        signatures[0].bodyBytes
          ? signatures[0].bodyBytes
          : signatures[0].bodybytes
      );

      let currentSignatures = [];
      signatures.map((s) => {
        let obj = {
          address: s.address,
          signature: s.signature,
        };

        currentSignatures = [...currentSignatures, obj];
      });

      const multisigAcc = await client.getAccount(multisigAccount.address);
      if (!multisigAcc) {
        dispatch(
          setError({
            type: "error",
            message: "multisig account does not exist on chain",
          })
        );
        setLoad(false);
        return;
      }

      let mapData = multisigAccount.pubkeyJSON || {};

      let newMapObj = {};
      let pubkeys = [];

      mapData?.value?.pubkeys.map((p) => {
        let obj = {
          type: p?.type,
          value: p?.value,
        };
        pubkeys = [...pubkeys, obj];
      });

      newMapObj = {
        type: mapData?.type,
        value: {
          threshold: mapData?.value?.threshold,
          pubkeys: pubkeys,
        },
      };

      const signedTx = makeMultisignedTx(
        newMapObj,
        multisigAcc.sequence,
        tx?.fee,
        bodyBytes,
        new Map(
          currentSignatures.map((s) => [s.address, fromBase64(s.signature)])
        )
      );

      const broadcaster = await StargateClient.connect(chainInfo?.config?.rpc);
      const result1 = await broadcaster.broadcastTx(
        Uint8Array.from(TxRaw.encode(signedTx).finish())
      );

      setLoad(false);
      if (result1.code == 0) {
        dispatch(
          updateTxn({
            txId: tx?._id,
            body: {
              status: "DONE",
              hash: result1?.transactionHash || "",
            },
          })
        );
      } else {
        dispatch(
          setError({
            type: "error",
            message: result1?.rawLog || "Failed to broadcast transaction",
          })
        );
        dispatch(
          updateTxn({
            txId: tx?._id,
            body: {
              status: "FAILED",
              hash: result1?.transactionHash || "",
            },
          })
        );
      }
    } catch (error) {
      setLoad(false);
      dispatch(
        setError({
          type: "error",
          message: error?.message || "Failed to broadcast transaction",
        })
      );
    }
  };

  return (
    <Button
      variant="contained"
      disableElevation
      size="small"
      onClick={() => {
        broadcastTxn();
      }}
      sx={{
        textTransform: "none",
      }}
    >
      {load ? "Loading..." : "Broadcast"}
    </Button>
  );
}
