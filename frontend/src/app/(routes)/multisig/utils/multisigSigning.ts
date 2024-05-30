import { getWalletAmino } from '@/txns/execute';
import { Txn } from '@/types/multisig';
import { SigningStargateClient } from '@cosmjs/stargate';
import { toBase64 } from '@cosmjs/encoding';

declare let window: WalletWindow;

const signTransaction = async (
  rpc: string,
  chainID: string,
  multisigAddress: string,
  unSignedTxn: Txn,
  walletAddress: string
) => {
  try {
    window.wallet.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        preferNoSetFee: true,
        disableBalanceCheck: true,
      },
    };
    const client = await SigningStargateClient.connect(rpc);

    const result = await getWalletAmino(chainID);
    const wallet = result[0];
    const signingClient = await SigningStargateClient.offline(wallet);

    const multisigAcc = await client.getAccount(multisigAddress);
    if (!multisigAcc) {
      throw new Error('Multisig account does not exist on chain');
    }

    const signerData = {
      accountNumber: multisigAcc?.accountNumber,
      sequence: multisigAcc?.sequence,
      chainId: chainID,
    };

    const msgs = unSignedTxn?.messages || [];

    const { signatures } = await signingClient.sign(
      walletAddress,
      msgs,
      unSignedTxn?.fee || { amount: [], gas: '' },
      unSignedTxn?.memo || '',
      signerData
    );

    const payload = {
      signer: walletAddress,
      txId: unSignedTxn.id || NaN,
      address: multisigAddress,
      signature: toBase64(signatures[0]),
    };

    return payload;
  } catch (error) {
    throw error;
  }
};

export default {
  signTransaction,
};
