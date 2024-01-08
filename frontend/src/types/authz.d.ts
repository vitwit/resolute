interface Authorization {
  granter: string;
  grantee: string;
  expiration: string | null;
  authorization: GenericAuthorization | SendAuthorization | StakeAuthorization;
}

interface GenericAuthorization {
  '@type': string;
  msg: string;
}

interface SendAuthorization {
  '@type': string;
  spend_limit: Coin[];
  allow_list?: string[];
}

interface StakeAuthorization {
  '@type': string;

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
  address: string,
  grants: Authorization[]
}
