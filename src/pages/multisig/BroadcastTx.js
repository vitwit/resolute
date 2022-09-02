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
import { updateTxn } from "../../features/multisig/multisigSlice";

async function getKeplrWalletAmino(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export default function BroadcastTx({ tx, signatures, multisigAccount }) {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const updateTxnRes = useSelector((state) => state.multisig.updateTxn);

  useEffect(() => {
    if (updateTxnRes.status === 200 || updateTxnRes.status === 201) {
      dispatch(
        setError({
          type: "success",
          message: updateTxnRes.message,
        })
      );
    } else if (updateTxnRes.status === 400 || updateTxnRes.status === 500) {
      dispatch(
        setError({
          type: "error",
          message: updateTxnRes.message || "Error",
        })
      );
    }
  }, [updateTxnRes]);

  const broadcastTxn = async () => {
    setLoad(true);
    const client = await SigningStargateClient.connect(chainInfo?.config?.rpc);

    let result = await getKeplrWalletAmino(chainInfo?.config?.chainId);
    const bodyBytes = fromBase64(
      signatures[0].bodyBytes
        ? signatures[0].bodyBytes
        : signatures[0].bodybytes
    );

    console.log('Before base64 body bytes', signatures[0].bodyBytes
      ? signatures[0].bodyBytes
      : signatures[0].bodybytes)
    console.log('After base64 body bytes', bodyBytes)

    let currentSignatures = [];
    signatures.map((s) => {
      let obj = {
        address: s.address,
        signature: s.signature,
      };

      currentSignatures = [...currentSignatures, obj];
    });

    const multisigAcc = await client.getAccount(multisigAccount.address);

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

    console.log('new map Obj', newMapObj)
    console.log('multisig sequence ', multisigAcc?.sequence)
    console.log('Pub keys ---- ', pubkeys)
    console.log('current signatures --', currentSignatures)

    const signedTx = makeMultisignedTx(
      newMapObj,
      multisigAcc.sequence,
      tx?.fee,
      bodyBytes,
      new Map(
        currentSignatures.map((s) => [s.address, fromBase64(s.signature)])
      )
    );

    try {
      const broadcaster = await StargateClient.connect(chainInfo?.config?.rpc);
      const result1 = await broadcaster.broadcastTx(
        Uint8Array.from(TxRaw.encode(signedTx).finish())
      );

      setLoad(false);

      dispatch(
        updateTxn({
          txId: tx?._id,
          body: {
            status: "DONE",
            hash: result1?.transactionHash || "",
          },
        })
      );
    } catch (err) {
      console.log("Errror broadcast", err, err.message);
      setLoad(false);
      dispatch(
        updateTxn({
          txId: tx?._id,
          body: {
            status: "FAILED",
            message: err?.message,
          },
        })
      );

      dispatch(
        setError({
          type: "error",
          message: err.message,
        })
      );
    }
  };

  return (
    <Button
      variant="contained"
      disableElevation
      className="pull-right"
      onClick={() => {
        broadcastTxn();
      }}
      sx={{
        textTransform: "none",
      }}
    >
      {load ? "Loading..." : "BroadCast"}
    </Button>
  );
}
