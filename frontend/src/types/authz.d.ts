import { Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';

interface Authorization {
  grant(grant: Grant): string;
  granter: string;
  grantee: string;
  expiration: string | null;
  authorization: GenericAuthorization | SendAuthorization | StakeAuthorization;
}

interface GenericAuthorization {
  spend_limit: Coin[];
  '@type': '/cosmos.authz.v1beta1.GenericAuthorization';
  msg: string;
}

interface SendAuthorization {
  msg: ReactNode;
  '@type': '/cosmos.bank.v1beta1.SendAuthorization';
  spend_limit: Coin[];
  allow_list?: string[];
}

interface StakeAuthorization {
  msg: ReactNode;
  spend_limit: Coin[];

  '@type': '/cosmos.staking.v1beta1.StakeAuthorization';

  max_tokens: null | Coin;
  allow_list: undefined | AddressList;
  deny_list: undefined | AddressList;
  authorization_type: AuthzDelegateType | AuthzReDelegateType | AuthzUnBondType;
}

interface AddressList {
  address: string[];
}

type AuthzUnBondType = 'AUTHORIZATION_TYPE_UNDELEGATE';
type AuthzDelegateType = 'AUTHORIZATION_TYPE_DELEGATE';
type AuthzReDelegateType = 'AUTHORIZATION_TYPE_REDELEGATE';

interface GetGrantsInputs {
  baseURL: string;
  address: string;
  pagination?: KeyLimitPagination;
  chainID: string;
}

interface GetGrantsResponse {
  grants: Authorization[];
  pagination: Pagination;
}

interface AddressGrants {
  address: string;
  chainID: string;
  grants: Authorization[];
}

interface Grant {
  msg: string;
  expiration: Date;
  spend_limit?: string;
  max_tokens?: string;
  isDenyList?: boolean;
  validators_list?: string[];
}

interface TxGrantAuthzInputs {
  basicChainInfo: BasicChainInfo;
  msgs: Msg[];
  denom: string;
  feeAmount: number;
  feegranter: string;
  onTxComplete?: ({ isTxSuccess, error, txHash }: OnTxnCompleteInputs) => void;
}

interface TxGrantMultiChainAuthzInputs {
  data: TxGrantAuthzInputs[];
}

interface MultiChainTx {
  ChainID: string;
  txInputs: TxGrantAuthzInputs;
}

interface OnTxnCompleteInputs {
  isTxSuccess: boolean;
  error?: string;
  txHash?: string;
}

interface ChainStatus {
  isTxSuccess?: boolean;
  txStatus: string;
  error: string;
  txHash: string;
}

interface txAuthzExecInputs {
  basicChainInfo: BasicChainInfo;
  feeDenom: string;
  metaData: string;
  msgs: Msg[];
  feeGranter?: string;
}
