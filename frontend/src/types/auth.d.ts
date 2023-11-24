interface BaseAccount {
  '@type': '/cosmos.auth.v1beta1.BaseAccount';
  address: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
}
interface BaseAccountInfoResponse {
  account: BaseAccount;
}
