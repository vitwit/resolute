import { getTypeURLName } from "./util";

interface AuthzMenuItem {
  label: string;
  typeURL: string;
}

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
    case "/cosmos.staking.v1beta1.StakeAuthorization":
      return getStakeAuthzType(authorization?.authorization_type)
    default:
      throw new Error("unsupported authorization");
  }
}

function getStakeAuthzType(type: string): string {
  switch (type) {
    case "AUTHORIZATION_TYPE_DELEGATE":
      return "/cosmos.staking.v1beta1.MsgDelegate"
    case "AUTHORIZATION_TYPE_UNDELEGATE":
      return "/cosmos.staking.v1beta1.MsgUndelegate"
    case "AUTHORIZATION_TYPE_REDELEGATE":
      return "/cosmos.staking.v1beta1.MsgBeginRedelegate"
    default:
      throw new Error("unsupported stake authorization type");
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
    } else if (
      grants[i]?.authorization["@type"] === "/cosmos.staking.v1beta1.StakeAuthorization" &&
      grants[i]?.authorization?.authorization_type === "AUTHORIZATION_TYPE_DELEGATE" &&
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
    } else if (
      grants[i]?.authorization["@type"] === "/cosmos.staking.v1beta1.StakeAuthorization" &&
      grants[i]?.authorization?.authorization_type === "AUTHORIZATION_TYPE_UNDELEGATE" &&
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
    } else if (
      grants[i]?.authorization["@type"] === "/cosmos.staking.v1beta1.StakeAuthorization" &&
      grants[i]?.authorization?.authorization_type === "AUTHORIZATION_TYPE_REDELEGATE" &&
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
    case "/cosmos.staking.v1beta1.StakeAuthorization":
      const temp = getStakeAuthzType(authorization?.authorization_type).split(".");
      if (temp.length === 0) {
        return "Unknown";
      }
      return temp[temp.length - 1];
    default:
      return "Unknown";
  }
}
