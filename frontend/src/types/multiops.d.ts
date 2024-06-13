interface TxExecuteMultiMsgInputs {
  msgs: Msg[];
  memo: string;
  basicChainInfo: BasicChainInfo;
  denom: string;
  rpc: string;
  rest: string;
  aminoConfig: AminoConfig;
  prefix: string;
  feeAmount: number;
  feegranter: string;
  gas: number;
  address: string;
}

interface TxnMsgProps {
  msg: Msg;
  onDelete: (index: number) => void;
  currency: Currency;
  index: number;
}

interface ValidatorOption {
  address: string;
  label: string; // moniker name
  identity: string;
}

type SendMsg = {
  type: 'Send';
  address: string;
  amount: string;
};

type DelegateMsg = {
  type: 'Delegate';
  validator: string;
  amount: string;
};

type UndelegateMsg = {
  type: 'Undelegate';
  validator: string;
  amount: string;
};

type RedelegateMsg = {
  type: 'Redelegate';
  sourceValidator: string;
  destValidator: string;
  amount: string;
};

type VoteMsg = {
  type: 'Vote';
  proposalId: string;
  option: string;
};

type CustomMsg = {
  type: 'Custom';
  typeUrl: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  value: any;
};

type Message =
  | SendMsg
  | DelegateMsg
  | UndelegateMsg
  | RedelegateMsg
  | VoteMsg
  | CustomMsg;

type TxnBuilderForm = {
  gas: number;
  memo: string;
  fees: number;
  msgs: Message[];
};

interface ProposalOption {
  label: string;
  value: string;
}

interface VoteOption {
  label: string;
  value: number;
}
