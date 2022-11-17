import { Grant } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";

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

export function getFeegrant(): Grant | null {
  const g = localStorage.getItem(TYPE_FEEGRANT);
  if (g) {
    const grant: Grant = JSON.parse(g);
    return grant;
  }
  return null;
}

export function setFeegrant(grant: Grant) {
  localStorage.setItem(TYPE_FEEGRANT, JSON.stringify(grant));
}

export function removeFeegrant() {
  localStorage.removeItem(TYPE_FEEGRANT);
}
