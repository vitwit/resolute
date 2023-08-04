import { Grant } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";


interface ChainWiseGrants {
  [key: string]: Grant;
}

export const KEY_WALLET_NAME: string = "WALLET_NAME";
export const KEY_DARK_MODE: string = "DARK_MODE";

export function setConnected() {
  localStorage.setItem("CONNECTED", "true");
}

export function isConnected(): boolean {
  const connected = localStorage.getItem("CONNECTED");
  if (connected && connected.length > 0) {
    return true;
  }
  return false;
}
export function logout() {
  localStorage.removeItem("CONNECTED");
}

const TYPE_FEEGRANT = "feegrant";

export function getFeegrant(): ChainWiseGrants | any {
  const g = localStorage.getItem(TYPE_FEEGRANT);
  if (g) {
    const grant: ChainWiseGrants = JSON.parse(g);
    return grant;
  }
  return null;
}

export function setFeegrant(grant: Grant, chainName: string) {
  const data: ChainWiseGrants = getFeegrant() || {};
  data[chainName] = grant;
  localStorage.setItem(TYPE_FEEGRANT, JSON.stringify(data));
}

export function removeFeegrant(chainName: string) {
  const data: ChainWiseGrants = getFeegrant() || {};
  delete data[chainName];
  localStorage.setItem(TYPE_FEEGRANT, JSON.stringify(data));
}

export function removeAllFeegrants() {
  localStorage.removeItem("feegrant");
}
