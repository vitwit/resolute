import Chip from "@mui/material/Chip";
import { Decimal } from "@cosmjs/math";


export function getTypeURLName(url) {
  let temp = url.split(".");
  if (temp?.length > 0) {
    return temp[temp?.length - 1];
  }
  return "-";
}

export function getProposalComponent(type) {
  switch (type) {
    case "PROPOSAL_STATUS_VOTING_PERIOD":
      return (
        <Chip
          label="Voting period"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
      return (
        <Chip
          label="Deposit period"
          color="secondary"
          size="small"
          variant="outlined"
        />
      );
    case "PROPOSAL_STATUS_REJECTED":
      return (
        <Chip label="Rejected" color="error" size="small" variant="outlined" />
      );
    case "PROPOSAL_STATUS_PASSED":
      return (
        <Chip label="Passed" color="primary" variant="contained" size="small" />
      );
    default:
      return (
        <Chip label="Unknown" color="error" size="small" variant="outlined" />
      );
  }
}

export function computeVotePercentage(tally) {
  if (tally == null || tally.yes == null) {
    return {
      yes: 0,
      no: 0,
      abstain: 0,
      no_with_veto: 0,
    };
  }
  let yes = parseInt(tally?.yes);
  let no = parseInt(tally?.no);
  let abstain = parseInt(tally?.abstain);
  let noWithVeto = parseInt(tally?.no_with_veto);
  let total = yes + no + abstain + noWithVeto;

  if (total === 0) {
    return {
      yes: 0,
      no: 0,
      abstain: 0,
      no_with_veto: 0,
    };
  }

  let result = {};
  result["yes"] = ((yes / total) * 100).toFixed(2);
  result["no"] = ((no / total) * 100).toFixed(2);
  result["abstain"] = ((abstain / total) * 100).toFixed(2);
  result["no_with_veto"] = ((noWithVeto / total) * 100).toFixed(2);

  return result;
}

export function shortenPubKey(pubKey, n) {
  return pubKey?.length > n ? pubKey.substr(0, n - 1) + "&hellip;" : pubKey;
}

export function shortenAddress(bech32, maxCharacters) {
  if (maxCharacters >= bech32?.length) {
    return bech32;
  }

  const i = bech32.indexOf("1");
  const prefix = bech32.slice(0, i);
  const address = bech32.slice(i + 1);

  maxCharacters -= prefix?.length;
  maxCharacters -= 3; // For "..."
  maxCharacters -= 1; // For "1"

  if (maxCharacters <= 0) {
    return "";
  }

  const mid = Math.floor(address?.length / 2);
  let former = address.slice(0, mid);
  let latter = address.slice(mid);

  while (maxCharacters < former?.length + latter?.length) {
    if ((former?.length + latter?.length) % 2 === 1 && former?.length > 0) {
      former = former.slice(0, former?.length - 1);
    } else {
      latter = latter.slice(1);
    }
  }

  return prefix + "1" + former + "..." + latter;
}

export function formatValidatorStatus(jailed, status) {
  if (jailed) {
    return (
      <Chip label="Jailed" color="error" size="small" variant="contained" />
    );
  }

  switch (status) {
    case "BOND_STATUS_BONDED":
      return (
        <Chip label="Bonded" color="primary" size="small" variant="outlined" />
      );
    case "BOND_STATUS_UNBONDED":
      return (
        <Chip
          label="Unbonded"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    case "BOND_STATUS_UNBONDING":
      return (
        <Chip
          label="Unbonding"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    default:
      return "Unknown";
  }
}

export function totalDelegations(delegations, coinDecimals) {
  let total = 0;
  for (let i = 0; i < delegations?.length; i++) {
    total += parseInt(delegations[i].balance.amount);
  }
  const temp = total / 10.0 ** coinDecimals;
  return `${parseFloat(temp.toFixed(6))}`;
}

export function totalRewards(rewards, coinDecimals) {
  if (rewards === undefined) return 0;
  if (rewards?.length === 0) {
    return 0;
  }
  let total = 0;

  for (let i = 0; i < rewards?.length; i++) {
    const reward = rewards[i].reward;
    if (reward?.length > 0) total += parseInt(reward[0].amount);
  }
  const temp = total / 10.0 ** coinDecimals;
  return `${parseFloat(temp.toFixed(6))}`;
}

export function totalUnbonding(unbonding, coinDecimals) {
  if (unbonding?.length === 0) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < unbonding?.length; i++) {
    for (let j = 0; j < unbonding[i].entries?.length; j++) {
      total += parseInt(unbonding[i].entries[j].balance);
    }
  }
  const temp = total / 10.0 ** coinDecimals;
  return `${parseFloat(temp.toFixed(6))}`;
}

export function mainValueToMinimum(amount, coinInfo) {
  if (Number(amount) !== "NaN") {
    return `${Number(amount) * 10 ** coinInfo.coinDecimals}${
      coinInfo.coinMinimalDenom
    }`;
  } else {
    return "";
  }
}

export function amountToMinimalValue(amount, coinInfo) {
  return Number(amount) * 10 ** coinInfo.coinDecimals;
}

export const setLocalStorage = (key, value, type) => {
  if (type === 'object') {
    localStorage.setItem(key, JSON.stringify(value))
    return
  } else {
    localStorage.setItem(key, value);
    return
  }
}

export const getLocalStorage = (key, type) => {
  if (type === 'object') {
    let obj = JSON.parse(localStorage.getItem(key));
    return obj
  } else {
    let value = localStorage.getItem(key)
    return value;
  }
}

export const getAmountObj = (amount = 0, chainInfo) => {
  const amountInAtomics = Decimal.fromUserInput(
    amount,
    Number(chainInfo.config.currencies[0].coinDecimals)
  ).atomics;

  return {
    amount: amountInAtomics,
    denom: chainInfo.config.currencies[0].coinMinimalDenom
  }
}

export const proposalStatus = {
  'PROPOSAL_EXECUTOR_RESULT_NOT_RUN': {
      label: 'Result not run',
      bgColor: '#e3bbbb',
      textColor: '#ad3131',
      color: 'error'
  },
  'PROPOSAL_STATUS_UNSPECIFIED': {
      label: 'Unspecified',
      bgColor: '#e3bbbb',
      textColor: '#ad3131',
      color: 'error'
  },
  'PROPOSAL_STATUS_SUBMITTED': {
      label: 'Submitted',
      bgColor: '#c5c9e3',
      textColor: '#3049d3',
      color: 'primary'
  }, 'PROPOSAL_STATUS_ACCEPTED': {
      label: 'Accepted',
      bgColor: '#d8dfd3',
      textColor: '#30b448',
      color: 'success'
  }, 'PROPOSAL_STATUS_REJECTED': {
      label: 'Rejected',
      bgColor: '#c5c9e3',
      textColor: '#3049d3',
      color: 'error'
  }, 'PROPOSAL_STATUS_ABORTED': {
      label: 'Aborted',
      bgColor: '#c5c9e3',
      textColor: '#3049d3',
      color: 'error'
  },
  'PROPOSAL_STATUS_WITHDRAWN': {
      label: 'Withdrawn',
      bgColor: '#e7d4ca',
      textColor: '#e56a11'
  },
}

export const ThresholdDecisionPolicy = `/cosmos.group.v1.ThresholdDecisionPolicy`;
export const PercentageDecisionPolicy = `/cosmos.group.v1.PercentageDecisionPolicy`;

export const PoliciesTypes = {
  '/cosmos.group.v1.PercentageDecisionPolicy': 'Percentage Decision Policy',
  '/cosmos.group.v1.ThresholdDecisionPolicy': 'Threshold Decision Policy'
}


