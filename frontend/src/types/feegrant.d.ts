interface Allowance {
  granter: string;
  grantee: string;
  allowance: BasicAllowance | AllowedMsgAllowance;
}

interface BasicAllowance {
  '@type': '/cosmos.feegrant.v1beta1.BasicAllowance';
  spend_limit: Coin[];
  expiration: string | null;
}

interface PeriodicAllowance {
  '@type': '/cosmos.feegrant.v1beta1.PeriodicAllowance';
  basic: {
    spend_limit: Coin[];
    expiration: string | null;
  };
  period: string;
  period_spend_limit: Coin[];
  period_can_spend: Coin[];
  period_reset: string;
}

interface AllowedMsgAllowance {
  '@type': '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';
  allowance: BasicAllowance | PeriodicAllowance;
  allowed_messages: string[];
}

interface GetFeegrantsInputs {
  baseURLs: string[];
  address: string;
  pagination?: KeyLimitPagination;
  chainID: string;
}

interface GetFeegrantsResponse {
  allowances: Allowance[];
  pagination: Pagination;
}
