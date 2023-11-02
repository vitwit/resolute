"use client";

import Axios from "axios";
import { API_URL } from "../../../constants/constants";

const GET_ACCOUNTS = "/multisig/accounts";

const getAccounts = (address: string) =>
  Axios.get(`${API_URL}${GET_ACCOUNTS}/${address}`);

const exportObj = {
  getAccounts: getAccounts,
};

export default exportObj;
