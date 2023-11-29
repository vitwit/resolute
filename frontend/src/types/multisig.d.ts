import { TxStatus } from './enums';

interface QueryParams {
  address: string;
  signature: string;
}

interface UpdateTxPayload {
  status: string;
  hash: string;
  error_message: string;
}

interface SignTxPayload {
  signer: string;
  signature: string;
}

interface Fee {
  amount: { amount: string; denom: string }[];
  gas: string;
  granter: string;
}

interface CreateTxnPayload {
  address: string;
  chain_id: string;
  messages: Msg[];
  fee: Fee;
  memo: string;
  gas: number;
}

interface Pubkey {
  type: string;
  value: string;
}

interface AddressPubkey {
  address: string;
  pubkey: Pubkey;
}

interface CreateAccountPayload {
  address: string;
  chainId: string;
  createdBy: string;
  name: string;
  threshold: number;
  pubkeys: AddressPubkey[];
}

interface VerifyUserPayload {
  address: string;
  signature: string;
  salt: number;
  pubKey: string;
}

interface DeleteTxnInputs {
  queryParams: QueryParams;
  data: {
    address: string;
    id: number;
  };
}

interface MultisigAddressPubkey {
  address: string;
  multisig_address: string;
  pubkey: Pubkey;
}

interface GetMultisigBalanceInputs {
  baseURL: string;
  address: string;
  denom: string;
}

interface FeeObject {
  amount: {
    amount: string;
    denom: string;
  }[];
  gas: string;
  granter?: string;
}

interface Account {
  address: string;
  threshhold: number;
  chain_id: string;
  pubkey_type: string;
  created_at: string;
  created_by: string;
  name: string;
}

interface CreateTxnInputs {
  data: CreateTxnPayload;
  queryParams: QueryParams;
}

interface MultisigAccounts {
  status: TxStatus;
  accounts: Account[];
  txnCounts: { [address: string]: number };
  total: number;
}
interface MultisigAccount {
  account: Account;
  pubkeys: MultisigAddressPubkey[];
  status: TxStatus;
  error: string;
}

interface VerifyAcccountRes {
  token: string;
  status: TxStatus;
  error: string;
}

interface CreateMultisigAccountRes {
  status: TxStatus;
  error: string;
}

interface DeleteTxnRes {
  status: TxStatus;
  error: string;
}

interface Balance {
  balance: {
    denom: string;
    amount: string;
  };
  status: TxStatus;
  error: string;
}

interface CreateTxnRes {
  status: TxStatus;
  error: string;
}

interface UpdateTxnRes {
  status: TxStatus;
  error: string;
}

interface UpdateTxnInputs {
  queryParams: QueryParams;
  data: {
    txId: number;
    address: string;
    body: {
      status: string;
      hash: string;
      error_message: '';
    };
  };
}

interface GetTxnsInputs {
  address: string;
  status: string;
}

interface Signature {
  address: string;
  signature: string;
}

interface Txn {
  id: string;
  multisig_Address: string;
  fee: FeeObject;
  status: string;
  messages: Msg[];
  hash: string;
  err_msg: '';
  memo: string;
  signatures: Signature[];
  last_updated: string;
  created_at: string;
}

interface Txns {
  list: Txn[];
  status: TxStatus;
  error: string;
}

interface SignTxInputs {
  data: {
    signer: string;
    txId: number;
    address: string;
    signature: string;
  };
  queryParams: QueryParams;
}
