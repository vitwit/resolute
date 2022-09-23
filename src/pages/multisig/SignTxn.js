import { Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SigningStargateClient } from "@cosmjs/stargate";
import { toBase64 } from "@cosmjs/encoding";
import { signTx } from "../../features/multisig/multisigSlice";
import { setError } from "../../features/common/commonSlice";
import PropTypes from "prop-types";

async function getKeplrWalletAmino(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

SignTxn.propTypes = {
  address: PropTypes.string.isRequired,
  txId: PropTypes.string.isRequired,
  unSignedTxn: PropTypes.object.isRequired,
};

export default function SignTxn(props) {
  const { txId, unSignedTxn, address } = props;
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

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

      const multisigAcc = await client.getAccount(address);
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

      console.log(multisigAcc);
      const signerData = {
        accountNumber: multisigAcc?.accountNumber,
        sequence: multisigAcc?.sequence,
        chainId: chainInfo?.config?.chainId,
      };

      let msgs = unSignedTxn.messages;

      console.log(msgs);
      const { bodyBytes, signatures } = await signingClient.sign(
        from,
        msgs,
        unSignedTxn.fee,
        unSignedTxn.memo,
        signerData
      );

      const payload = {
        signer: from,
        txId: txId,
        address: address,
        signature: toBase64(signatures[0]),
      };

      dispatch(signTx(payload));
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
      size="small"
      onClick={() => {
        signTheTx();
      }}
      sx={{
        textTransform: "none",
      }}
    >
      {load ? "Loading..." : "Sign"}
    </Button>
  );
}
