import { AllowedMsgAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import { getTypeURLName } from "./util";

interface AuthzMenuItem {
  label: string;
  typeURL: string;
}

const SEND_V1BETA1_TYPEURL = "/cosmos.bank.v1beta1.MsgSend";
const VOTE_V1BETA1_TYPEURL = "/cosmos.gov.v1beta1.MsgVote";
const DELEGATE_V1BETA1_TYPEURL =
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
const UNDELEGATE_V1BETA1_TYPEURL = "/cosmos.staking.v1beta1.MsgUndelegate";
const REDELEGATE_V1BETA1_TYPEURL = "/cosmos.staking.v1beta1.MsgBeginRedelegate";
const WITHDRAW_REWARDS_V1BETA1_TYPEURL =
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
const GRANT_ALLOWANCE_V1BETA1_TYPEURL =
  "/cosmos.feegrant.v1beta1.MsgGrantAllowance";
const REVOKE_ALLOWANCE_V1BETA1_TYPEURL =
  "/cosmos.feegrant.v1beta1.MsgRevokeAllowance";

export function authzMsgTypes(): AuthzMenuItem[] {
  return [
    {
      label: "Send",
      typeURL: "/cosmos.bank.v1beta1.MsgSend",
    },
    {
      label: "Grant Authz",
      typeURL: "/cosmos.authz.v1beta1.MsgGrant",
    },
    {
      label: "Revoke Authz",
      typeURL: "/cosmos.authz.v1beta1.MsgRevoke",
    },
    {
      label: "Grant Feegrant",
      typeURL: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
    },
    {
      label: "Revoke Feegrant",
      typeURL: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
    },
    {
      label: "Submit Proposal",
      typeURL: "/cosmos.gov.v1beta1.MsgSubmitProposal",
    },
    {
      label: "Vote",
      typeURL: "/cosmos.gov.v1beta1.MsgVote",
    },
    {
      label: "Deposit",
      typeURL: "/cosmos.gov.v1beta1.MsgDeposit",
    },
    {
      label: "Withdraw Rewards",
      typeURL: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    },
    {
      label: "Redelegate",
      typeURL: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    },
    {
      label: "Delegate",
      typeURL: "/cosmos.staking.v1beta1.MsgDelegate",
    },
    {
      label: "Undelegate",
      typeURL: "/cosmos.staking.v1beta1.MsgUndelegate",
    },
    {
      label: "Withdraw Commission",
      typeURL: "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission",
    },
    {
      label: "Unjail",
      typeURL: "/cosmos.slashing.v1beta1.MsgUnjail",
    },
  ];
}

export function getTypeURLFromAuthorization(authorization: any): string {
  switch (authorization["@type"]) {
    case "/cosmos.bank.v1beta1.SendAuthorization":
      return "/cosmos.bank.v1beta1.MsgSend";
    case "/cosmos.authz.v1beta1.GenericAuthorization":
      return authorization.msg;
    default:
      throw new Error("unsupported authorization");
  }
}

export function getVoteAuthz(grants: any, granter: string): any | null {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg === "/cosmos.gov.v1beta1.MsgVote" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getSendAuthz(grants: any, granter: string): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      (grants[i]?.authorization?.msg === "/cosmos.bank.v1beta1.MsgSend" ||
        grants[i]?.authorization["@type"] ===
          "/cosmos.bank.v1beta1.SendAuthorization") &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getUnjailAuthz(grants: any, granter: string): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg === "/cosmos.slashing.v1beta1.MsgUnjail" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getWithdrawRewardsAuthz(
  grants: any,
  granter: string
): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg ===
        "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getDelegateAuthz(grants: any, granter: string): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg === "/cosmos.staking.v1beta1.MsgDelegate" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getUnDelegateAuthz(grants: any, granter: string): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg ===
        "/cosmos.staking.v1beta1.MsgUndelegate" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getReDelegateAuthz(grants: any, granter: string): null | any {
  if (!grants) {
    return null;
  }

  for (let i = 0; i < grants.length; i++) {
    if (
      grants[i]?.authorization?.msg ===
        "/cosmos.staking.v1beta1.MsgBeginRedelegate" &&
      grants[i]?.granter === granter
    ) {
      return grants[i];
    }
  }

  return null;
}

export function getMsgNameFromAuthz(authorization: any): string {
  switch (authorization["@type"]) {
    case "/cosmos.bank.v1beta1.SendAuthorization":
      return "MsgSend";
    case "/cosmos.authz.v1beta1.GenericAuthorization":
      return getTypeURLName(authorization.msg);
    default:
      return "Unknown";
  }
}

export interface AuthzTabs {
  sendEnabled: boolean;
  govEnabled: boolean;
  stakingEnabled: boolean;
  daosEnabled: boolean;
  feegrantEnabled: boolean;
  multisigEnabled: boolean;
  authzEnabled: boolean;
  airdropEnabled: boolean;
}

const SEND_AUTHZ = "/cosmos.authz.v1beta1.SendAuthorization";
const GENERIC_AUTHZ = "/cosmos.authz.v1beta1.GenericAuthorization";
const STAKE_AUTHZ =  "/cosmos.authz.v1beta1.StakeAuthorization";

export function getAuthzTabs(authorizations: any[]): AuthzTabs {
  let result: AuthzTabs = {
    airdropEnabled: false,
    authzEnabled: false,
    daosEnabled: false,
    feegrantEnabled: false,
    govEnabled: false,
    multisigEnabled: false,
    sendEnabled: false,
    stakingEnabled: false,
  };
  for (let i = 0; i < authorizations.length; i++) {
    if (authorizations[i].authorization["@type"] === SEND_AUTHZ) {
      result.sendEnabled = true;
    } else if (authorizations[i].authorization["@type"] === STAKE_AUTHZ) {
      result.stakingEnabled = true;
    }
    else if (authorizations[i].authorization["@type"] === GENERIC_AUTHZ) {
      switch (authorizations[i].authorization?.msg) {
        case SEND_V1BETA1_TYPEURL:
          result.sendEnabled = true;
          break;

        case VOTE_V1BETA1_TYPEURL:
          result.govEnabled = true;
          break;

        case WITHDRAW_REWARDS_V1BETA1_TYPEURL:
        case DELEGATE_V1BETA1_TYPEURL:
        case UNDELEGATE_V1BETA1_TYPEURL:
        case REDELEGATE_V1BETA1_TYPEURL:
          result.stakingEnabled = true;
          break;

        case GRANT_ALLOWANCE_V1BETA1_TYPEURL:
        case REVOKE_ALLOWANCE_V1BETA1_TYPEURL:
          result.feegrantEnabled = true;
          break;
      }
      if(authorizations[i].authorization?.msg.includes("cosmos.group.")) {
        result.daosEnabled = true;
      }
    }
  }
  return result;
}
