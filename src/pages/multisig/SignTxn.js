import { Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SigningStargateClient } from "@cosmjs/stargate";
import { toBase64 } from "@cosmjs/encoding";
import { createSign } from "../../features/multisig/multisigSlice";
import { setError } from "../../features/common/commonSlice";

async function getKeplrWalletAmino(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export default function SignTxn({ txId, tx: unSignedTxn }) {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const multisigAddress =
    localStorage.getItem("multisigAddress") &&
    JSON.parse(localStorage.getItem("multisigAddress"));
  const from = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);

  const signTheTx = async () => {
    setLoad(true);
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        preferNoSetFee: true,
        disableBalanceCheck: true,
      },
    };
    try {
      const client = await SigningStargateClient.connect(
        chainInfo?.config?.rpc
      );

      let result = await getKeplrWalletAmino(chainInfo?.config?.chainId);
      var wallet = result[0];
      const signingClient = await SigningStargateClient.offline(wallet);

      const multisigAcc = await client.getAccount(multisigAddress?.address);

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

      const signerData = {
        accountNumber: multisigAcc?.accountNumber,
        sequence: multisigAcc?.sequence,
        chainId: chainInfo?.config?.chainId,
      };

      let msgs = unSignedTxn.msgs;

      const { bodyBytes, signatures } = await signingClient.sign(
        from,
        msgs,
        unSignedTxn.fee,
        unSignedTxn.memo,
        signerData
      );

      let obj = {
        address: from,
        txId: txId,
        multisigAddress: multisigAddress?.address,
        bodyBytes: toBase64(bodyBytes),
        signature: toBase64(signatures[0]),
      };

      dispatch(createSign(obj));
      setLoad(false);
    } catch (error) {
      setLoad(false);
      dispatch(setError({ type: "error", message: error.message }));
    }
  };

  return (
    <Button
      variant="contained"
      disableElevation
      className="pull-right"
      onClick={() => {
        signTheTx();
      }}
    >
      {load ? "Loading..." : "Sign"}
    </Button>
  );
}
