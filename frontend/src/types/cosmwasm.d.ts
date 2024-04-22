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