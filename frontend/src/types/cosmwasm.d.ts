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
}
