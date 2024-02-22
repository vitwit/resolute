interface ParsedTransaction {
  code: number;
  gas_used: string;
  gas_wanted: string;
  height: string;
  raw_log: string;
  timestamp: string;
  memo: string;
  messages: any[];
  chain_id: string;
  fee: Coin[];
  address: string;
}
