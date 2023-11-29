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

interface Msg {
  typeUrl: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  value: any;
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
    denom: any;
  }[];
  gas: string;
  granter: string;
}

interface CreateTxnInputs {
  data: CreateTxnPayload;
  queryParams: QueryParams;
}
