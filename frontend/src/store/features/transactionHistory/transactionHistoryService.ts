import { NUMIA_BEARER_TOKEN } from '@/utils/constants';
import { cleanURL } from '@/utils/util';
import axios, { AxiosResponse } from 'axios';

const bankSendTxnsURL = (senderAddress: string) =>
  `/cosmos/tx/v1beta1/txs?events=message.sender='${senderAddress}'&events=message.module='bank'`;

const stakingTxnsURL = (senderAddress: string) =>
  `/cosmos/tx/v1beta1/txs?events=message.sender='${senderAddress}'&events=message.module='staking'`;

const distributionTxnsURL = (senderAddress: string) =>
  `/cosmos/tx/v1beta1/txs?events=message.sender='${senderAddress}'&events=message.module='distribution'`;

const feegrantTxnsURL = (granterAddress: string) =>
  `/cosmos/tx/v1beta1/txs?events=message.granter='${granterAddress}'&events=message.module='feegrant'`;

const slashingTxnsURL = (validatorAddress: string) =>
  `/cosmos/tx/v1beta1/txs?events=message.sender='${validatorAddress}'&events=message.module='staking'`;

const fetchBankSendTxns = ({
  baseURL,
  senderAddress,
}: {
  baseURL: string;
  senderAddress: string;
}): Promise<AxiosResponse<any>> => {
  let uri = `${cleanURL(baseURL)}${bankSendTxnsURL(senderAddress)}`;
  return axios.get(uri);
};

const fetchStakingTxns = ({
  baseURL,
  senderAddress,
}: {
  baseURL: string;
  senderAddress: string;
}): Promise<AxiosResponse<any>> => {
  let uri = `${cleanURL(baseURL)}${stakingTxnsURL(senderAddress)}`;
  return axios.get(uri);
};

const fetchDistributionTxns = ({
  baseURL,
  senderAddress,
}: {
  baseURL: string;
  senderAddress: string;
}): Promise<AxiosResponse<any>> => {
  let uri = `${cleanURL(baseURL)}${distributionTxnsURL(senderAddress)}`;
  return axios.get(uri, {
    headers: { Authorization: `Bearer ${NUMIA_BEARER_TOKEN}` },
  });
};

const fetchFeegrantTxns = ({
  baseURL,
  granterAddress,
}: {
  baseURL: string;
  granterAddress: string;
}): Promise<AxiosResponse<any>> => {
  let uri = `${cleanURL(baseURL)}${feegrantTxnsURL(granterAddress)}`;
  return axios.get(uri, {
    headers: { Authorization: `Bearer ${NUMIA_BEARER_TOKEN}` },
  });
};

const fetchSlashingTxns = ({
  baseURL,
  validatorAddress,
}: {
  baseURL: string;
  validatorAddress: string;
}): Promise<AxiosResponse<any>> => {
  let uri = `${cleanURL(baseURL)}${slashingTxnsURL(validatorAddress)}`;
  return axios.get(uri, {
    headers: { Authorization: `Bearer ${NUMIA_BEARER_TOKEN}` },
  });
};

const result = {
  fetchBankSendTxns,
  fetchStakingTxns,
  fetchDistributionTxns,
  fetchFeegrantTxns,
  fetchSlashingTxns,
};

export default result;
