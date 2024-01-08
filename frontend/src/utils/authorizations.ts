interface AuthzMenuItem {
    txn: string;
    typeURL: string;
  }

export function authzMsgTypes(): AuthzMenuItem[] {
    return [
      {
        txn: "Send",
        typeURL: "/cosmos.bank.v1beta1.MsgSend",
      },
      {
        txn: "Grant Authz",
        typeURL: "/cosmos.authz.v1beta1.MsgGrant",
      },
      {
        txn: "Revoke Authz",
        typeURL: "/cosmos.authz.v1beta1.MsgRevoke",
      },
      {
        txn: "Grant Feegrant",
        typeURL: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
      },
      {
        txn: "Revoke Feegrant",
        typeURL: "/cosmos.feegrant.v1beta1.MsgRevokeAllowance",
      },
      {
        txn: "Submit Proposal",
        typeURL: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      },
      {
        txn: "Vote",
        typeURL: "/cosmos.gov.v1beta1.MsgVote",
      },
      {
        txn: "Deposit",
        typeURL: "/cosmos.gov.v1beta1.MsgDeposit",
      },
      {
        txn: "Withdraw Rewards",
        typeURL: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      },
      {
        txn: "Redelegate",
        typeURL: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
      },
      {
        txn: "Delegate",
        typeURL: "/cosmos.staking.v1beta1.MsgDelegate",
      },
      {
        txn: "Undelegate",
        typeURL: "/cosmos.staking.v1beta1.MsgUndelegate",
      },
      {
        txn: "Withdraw Commission",
        typeURL: "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission",
      },
      {
        txn: "Unjail",
        typeURL: "/cosmos.slashing.v1beta1.MsgUnjail",
      },
    ];
  }
  