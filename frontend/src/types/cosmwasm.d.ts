interface ContractInfo {
  code_id: string;
  creator: string;
  admin: string;
  label: string;
  created: {
    block_height: string;
    tx_index: string;
  };
  ibc_port_id: string;
  extension: string | null;
}

interface ContractInfoResponse {
  address: string;
  contract_info: ContractInfo;
}

interface AssetInfo {
  coinMinimalDenom: string;
  decimals: number;
  symbol: string;
}

interface FundInfo {
  amount: string;
  denom: string;
  decimals: number;
}

interface ParsedExecuteTxnResponse {
  code: number;
  fee: Coin[];
  transactionHash: string;
  rawLog: string;
  memo: string;
}

interface ParsedUploadTxnResponse extends ParsedExecuteTxnResponse {
  codeId: string;
}

interface ParsedInstatiateTxnResponse extends ParsedUploadTxnResponse {
  contractAddress: string;
}

interface GetQueryContractFunctionInputs {
  address: string;
  baseURLs: string[];
  queryData: string;
}

interface QueryContractInfoInputs {
  address: string;
  baseURLs: string[];
  queryData: string;
  chainID: string;
  getQueryContract: ({
    address,
    baseURLs,
    queryData,
  }: GetQueryContractFunctionInputs) => Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any;
  }>;
}

interface GetExecutionOutputFunctionInputs {
  rpcURLs: string[];
  chainID: string;
  contractAddress: string;
  walletAddress: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  msgs: any;
  funds:
    | {
        amount: string;
        denom: string;
      }[]
    | undefined;
}

interface ExecuteContractInputs {
  rpcURLs: string[];
  chainID: string;
  contractAddress: string;
  walletAddress: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  msgs: any;
  baseURLs: string[];
  funds: { amount: string; denom: string }[] | undefined;
  getExecutionOutput: ({
    rpcURLs,
    chainID,
    contractAddress,
    walletAddress,
    msgs,
    funds,
  }: GetExecutionOutputFunctionInputs) => Promise<{
    txHash: string;
  }>;
}

interface UploadContractFunctionInputs {
  chainID: string;
  address: string;
  messages: Msg[];
}

interface UploadCodeInputs {
  chainID: string;
  address: string;
  messages: Msg[];
  baseURLs: string[];
  uploadContract: ({
    chainID,
    address,
    messages,
  }: UploadContractFunctionInputs) => Promise<{
    codeId: string;
    txHash: string;
  }>;
}

interface InstantiateContractFunctionInputs {
  chainID: string;
  codeId: number;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  msg: any;
  label: string;
  admin?: string;
  funds?: Coin[];
}

interface InstantiateContractInputs {
  chainID: string;
  codeId: number;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  msg: any;
  label: string;
  admin?: string;
  funds?: Coin[];
  baseURLs: string[];
  instantiateContract: ({
    chainID,
    codeId,
    msg,
    label,
    admin,
    funds,
  }: InstantiateContractFunctionInputs) => Promise<{
    codeId: string;
    contractAddress: string;
    txHash: string;
  }>;
}

interface QueryContractInputsI {
  messagesLoading: boolean;
  contractMessages: string[];
  handleSelectMessage: (msg: string) => Promise<void>;
  contractMessageInputs: string[];
  selectedMessage: string;
  hanldeSelectedMessageInputChange: (value: string) => void;
  queryText: string;
  handleQueryChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onQuery: (queryInput: string) => void;
  queryLoading: TxStatus;
  formatJSON: () => boolean;
  messageInputsLoading: boolean;
  messageInputsError: string;
}

interface MessageInputField {
  name: string;
  value: string;
  open: boolean;
}
