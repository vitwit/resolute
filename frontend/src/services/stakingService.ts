const validatorsURL = "/cosmos/staking/v1beta1/validators";
const delegationsURL = "/cosmos/staking/v1beta1/delegations/";
const unbondingDelegationsURL = (address: string) =>
  `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
const paramsURL = "/cosmos/staking/v1beta1/params";
const poolURL = "/cosmos/staking/v1beta1/pool";

const fetchValidators = async (
  baseURL: string,
): Promise<Response> => {
  let uri = `${baseURL}${validatorsURL}`;

  return await fetch(uri);
};

const fetchDelegations = async (
  baseURL: string,
  address: string,
): Promise<Response> => {
  let uri = `${baseURL}${delegationsURL}${address}`;

  return await fetch(uri);
};

const fetchUnbonding = async (
  baseURL: string,
  address: string,
): Promise<Response> => {
  let uri = `${baseURL}${unbondingDelegationsURL(address)}`;

  return await fetch(uri);
};

const fetchParams = async (baseURL: string): Promise<Response> =>
  fetch(`${baseURL}${paramsURL}`);

const fetchPoolInfo = (baseURL: string): Promise<Response> =>
  fetch(`${baseURL}${poolURL}`);

const result = {
  validators: fetchValidators,
  delegations: fetchDelegations,
  unbonding: fetchUnbonding,
  params: fetchParams,
  poolInfo: fetchPoolInfo,
};

export default result;
