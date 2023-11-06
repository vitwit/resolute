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

interface LogEvent {
  type: string;
  attributes: Array<{ key: string; value: string }>;
}

interface TxLog {
  msg_index: number;
  log: string;
  events: LogEvent[];
}

interface AuthInfo {
  public_key: {
    '@type': string;
    key: string;
  };
  mode_info: {
    single: {
      mode: string;
    };
  };
  sequence: string;
}

interface Fee {
  amount: Array<{ denom: string; amount: string }>;
  gas_limit: string;
  payer: string;
  granter: string;
}

interface MessageBody {
  '@type': string;
  delegator_address: string;
  validator_address: string;
}

interface TxBody {
  messages: MessageBody[];
  memo: string;
  timeout_height: string;
  extension_options: never[]; // Use an empty array for no data
  non_critical_extension_options: never[]; // Use an empty array for no data
}

interface TxSignature {
  '@type': string;
  body: TxBody;
  auth_info: AuthInfo;
  signatures: string[];
}

interface EventAttribute {
  key: string;
  value: string;
  index: boolean;
}

interface Event {
  type: string;
  attributes: EventAttribute[];
}

type TxResponse = {
  height?: string;
  txhash: string;
  codespace?: string;
  code: number;
  data?: string;
  raw_log?: string;
  logs?: TxLog[];
  info?: string;
  gas_wanted?: string;
  gas_used?: string;
  tx?: TxSignature;
  timestamp?: string;
  events?: Event[];
};

type ParsedTxResponse = {
  code: number;
  height?: string;
  rawLog?: string;
  transactionHash: string;
  gasUsed?: string;
  gasWanted?: string;
};
