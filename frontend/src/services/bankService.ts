const balancesURL = "/cosmos/bank/v1beta1/balances/";
const balanceURL = (address: string, denom: string) =>
  `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;

const fetchBalances = async (
  baseURL: string,
  address: string,
  pagination: any
):Promise<Response> => {
  let uri = `${baseURL}${balancesURL}${address}`;
  return await fetch(uri);
};

const fetchBalance = async (
  baseURL: string,
  address: string,
  denom: string
):Promise<Response> => {
  const uri = `${baseURL}${balanceURL(address, denom)}`;
  return await fetch(uri);
};

const result = {
  balances: fetchBalances,
  balance: fetchBalance,
};

export default result;
