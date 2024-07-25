import { MultisigTxStatus, TxStatus } from './enums';

interface QueryParams {
  address: string;
  signature: string;
}

interface UpdateTxPayload {
  status: MultisigTxStatus;
  hash: string;
  error_message: string;
}

interface SignTxPayload {
  signer: string;
  signature: string;
}

interface Fee {
  amount: {
    amount: string;
    denom: string;
  }[];
  gas: string;
  granter: string;
}

interface CreateTxnPayload {
  address: string;
  chain_id: string;
  messages: Msg[];
  fee: StdFee;
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

interface GetMultisigBalancesInputs {
  baseURL: string;
  baseURLs: string[];
  address: string;
  chainID: string;
}

interface Account {
  address: string;
  threshold: number;
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

interface MultisigState {
  multisigAccounts: MultisigAccounts;
  verifyAccountRes: VerifyAccountRes;
  createMultisigAccountRes: TxRes;
  deleteTxnRes: TxRes;
  deleteMultisigRes: TxRes;
  multisigAccount: MultisigAccount;
  balance: Balance;
  createTxnRes: TxRes;
  updateTxnRes: TxRes;
  txns: Txns;
  signTxRes: TxRes;
  signTransactionRes: TxRes;
  multisigAccountData: {
    account: ImportMultisigAccountRes;
    status: TxStatus;
    error: string;
  };
  verifyDialogOpen: boolean;
  broadcastTxnRes: {
    status: TxStatus;
    error: string;
    txHash: string;
    txResponse: {
      code: number;
      fee: Coin[];
      transactionHash: string;
      rawLog: string;
      memo: string;
    };
  };
}

interface VerifyAccountRes {
  token: string;
  status: TxStatus;
  error: string;
}

interface TxRes {
  status: TxStatus;
  error: string;
}

interface Balance {
  balance: Coin[];
  status: TxStatus;
  error: string;
}

interface UpdateTxnInputs {
  queryParams: QueryParams;
  data: {
    txId: number;
    address: string;
    body: {
      status: MultisigTxStatus;
      hash: string;
      error_message: string;
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
  id: number;
  multisig_address: string;
  fee: Fee;
  status: string;
  messages: Msg[];
  hash: string;
  err_msg: string;
  memo: string;
  signatures: Signature[];
  last_updated: string;
  created_at: string;
  pubkeys?: MultisigAddressPubkey[];
  threshold?: number;
}

interface TxnCount {
  computed_status: string;
  count: number;
}

interface Txns {
  list: Txn[];
  status: TxStatus;
  error: string;
  Count: TxnCount[]
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

interface TxnMsgProps {
  msg: Msg;
  onDelete: (index: number) => void;
  currency: Currency;
  index: number;
}

interface DeleteMultisigInputs {
  queryParams: QueryParams;
  data: {
    address: string;
  };
}

interface ImportMultisigAccountRes {
  account: {
    '@type': string;
    address: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    pub_key: any;
    account_number: string;
    sequence: string;
  };
}

interface DialogCreateMultisigProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
}

interface PubKeyFields {
  name: string;
  value: string;
  label: string;
  placeHolder: string;
  required: boolean;
  disabled: boolean;
  pubKey: string;
  address: string;
  isPubKey: boolean;
  error: string;
}

interface InputTextComponentProps {
  index: number;
  field: PubKeyFields;
  handleRemoveValue: (index: number) => void;
  handleChangeValue: (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  togglePubKey: (index: number) => void;
  isImport: boolean;
}
