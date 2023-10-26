"use client";

import Axios from "axios";

const BASE_URL = "http://localhost:1323";

const GET_ACCOUNTS = "/multisig/accounts";

const getAccounts = (address: string) =>
  Axios.get(`${BASE_URL}${GET_ACCOUNTS}/${address}`);

export default {
  getAccounts: getAccounts,
};
