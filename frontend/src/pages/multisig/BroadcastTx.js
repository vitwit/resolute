import { fromBase64 } from "@cosmjs/encoding";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import { SigningStargateClient, makeMultisignedTx } from "@cosmjs/stargate";
import { useDispatch, useSelector } from "react-redux";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { setError } from "../../features/common/commonSlice";
import {
  resetUpdateTxnState,
  updateTxn,
} from "../../features/multisig/multisigSlice";
import PropTypes from "prop-types";
import { NewMultisigThreshoPubkey } from "./tx/utils";
import { useParams } from "react-router-dom";

async function getKeplrWalletAmino(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

BroadcastTx.propTypes = {
  tx: PropTypes.object.isRequired,
  multisigAccount: PropTypes.object.isRequired,
};

export default function BroadcastTx(props) {
  const { tx, multisigAccount } = props;
  const { networkName } = useParams();

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainInfo = networks[nameToChainIDs[networkName]]?.network;

  const updateTxnRes = useSelector((state) => state.multisig.updateTxn);

  useEffect(() => {
    if (updateTxnRes.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: updateTxnRes?.message || "something went wrong",
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

      const multisigAcc = await client.getAccount(
        multisigAccount?.account.address
      );
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

      let mapData = multisigAccount.pubkeys || {};
      let pubkeys = [];

      mapData.map((p) => {
        const parsed = p?.pubkey;
        let obj = {
          type: parsed?.type,
          value: parsed?.value,
        };
        pubkeys = [...pubkeys, obj];
      });

      const multisigThresholdPK = NewMultisigThreshoPubkey(
        pubkeys,
        `${multisigAccount?.account?.threshold}`
      );

      const txBody = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: {
          messages: tx.messages,
          memo: tx.memo,
        },
      };

      let keplr = await getKeplrWalletAmino(chainInfo?.config?.chainId);
      const offlineClient = await SigningStargateClient.offline(keplr[0]);
      const txBodyBytes = offlineClient.registry.encode(txBody);

      const signedTx = makeMultisignedTx(
        multisigThresholdPK,
        multisigAcc.sequence,
        tx?.fee,
        txBodyBytes,
        new Map(tx?.signatures.map((s) => [s.address, fromBase64(s.signature)]))
      );

      const result = await client.broadcastTx(
        Uint8Array.from(TxRaw.encode(signedTx).finish())
      );

      setLoad(false);
      if (result.code === 0) {
        dispatch(
          updateTxn({
            txId: tx?.id,
            address: multisigAccount?.account.address,
            body: {
              status: "SUCCESS",
              hash: result?.transactionHash || "",
              error_message: "",
            },
          })
        );
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog || "Failed to broadcast transaction",
          })
        );
        dispatch(
          updateTxn({
            txId: tx.id,
            address: multisigAccount?.account.address,
            body: {
              status: "FAILED",
              hash: result?.transactionHash || "",
              error_message:
                result?.rawLog || "Failed to broadcast transaction",
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

      dispatch(
        updateTxn({
          txId: tx?.id,
          address: multisigAccount?.account.address,
          body: {
            status: "FAILED",
            hash: "",
            error_message: error?.message || "Failed to broadcast transaction",
          },
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
