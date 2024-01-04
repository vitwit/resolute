interface PubKey {
  '@type': string;
  key: string;
}

type Account = {
  '@type': string;
  address: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
};

interface GetAccountResponse {
  account: Account;
}

interface FeeForAuthInfoBytes {
  amount?:
    | {
        denom?: string | undefined;
        amount?: string | undefined;
      }[]
    | undefined;
  gasLimit?: bigint | undefined;
  payer?: string | undefined;
  granter?: string | undefined;
}

interface Message {
  type_url: string;
  value: string;
}

interface ExtensionOption {
  type_url: string;
  value: string;
}

interface SignerInfo {
  public_key: {
    type_url: string;
    value: string;
  };
  mode_info: {
    single?: {
      mode: 'SIGN_MODE_UNSPECIFIED';
    };
    multi?: {
      bitarray: {
        extra_bits_stored: number;
        elems: string;
      };
      mode_infos: string[];
    };
  };
  sequence: string;
}

interface Fee {
  amount: Coin[];
  gas_limit: string;
  payer: string;
  granter: string;
}

interface Tip {
  amount: Coin[];
  tipper: string;
}

interface AuthInfo {
  signer_infos: SignerInfo[];
  fee: Fee;
  tip: Tip;
}

interface LogEventAttribute {
  key: string;
  value: string;
}

interface LogEvent {
  type: string;
  attributes: LogEventAttribute[];
}

interface Log {
  msg_index: number;
  log: string;
  events: LogEvent[];
}

interface Tx {
  '@type': string;
  body: {
    messages: Message[];
    memo: string;
    timeout_height: string;
    extension_options: ExtensionOption[];
    non_critical_extension_options: ExtensionOption[];
  };
  auth_info: AuthInfo;
  signatures: string[];
}

interface TxResponse {
  height: string;
  txhash: string;
  tx: Tx;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: Log[];
  info: string;
  gas_wanted: string;
  gas_used: string;
  timestamp: string;
  events: LogEvent[];
}

interface ParsedTxResponse {
  code: number;
  height?: string;
  rawLog?: string;
  transactionHash: string;
  gasUsed?: string;
  gasWanted?: string;
  fee?: Coin[];
  time?: string;
  memo?: string;
}
