import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalance } from "../features/bank/bankSlice";
import BalanceInfo from "../components/BalanceInfo";
import { getDelegations, getUnbonding } from "../features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "../features/distribution/distributionSlice";
import { totalBalance } from "../utils/denom";
import { totalDelegations, totalRewards, totalUnbonding } from "../utils/util";
import { useParams } from "react-router-dom";
import { setSelectedNetwork } from "../features/common/commonSlice";

export default function Overview() {
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const connected = useSelector((state) => state.wallet.connected);
  const address = useSelector((state) => state.wallet.address);
  const balance = useSelector((state) => state.bank.balance);
  const delegations = useSelector((state) => state.staking.delegations);
  const rewards = useSelector((state) => state.distribution.delegatorRewards);
  const unbonding = useSelector((state) => state.staking.unbonding);

  const selectedAuthz = useSelector((state) => state.authz.selected);

  const [available, setTotalBalance] = useState(0);
  const [delegated, setTotalDelegations] = useState(0);
  const [pendingRewards, setTotalRewards] = useState(0);
  const [unbondingDel, setTotalUnbonding] = useState(0);

  const dispatch = useDispatch();

  const { network } = useParams();
  const selectedNetwork = useSelector((state) => state.common.selectedNetwork);
  useEffect(() => {
    if (selectedNetwork !== network) {
      dispatch(setSelectedNetwork(network));
    }
  }, []);

  useEffect(() => {
    if (connected && chainInfo.config.currencies.length > 0) {
      setTotalBalance(
        totalBalance(
          balance.balance,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
      setTotalDelegations(
        totalDelegations(
          delegations.delegations,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
      setTotalRewards(
        totalRewards(rewards?.list, chainInfo.config.currencies[0].coinDecimals)
      );
      setTotalUnbonding(
        totalUnbonding(
          unbonding.delegations,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
    }
  }, [balance, delegations, rewards, unbonding, chainInfo, address]);

  useEffect(() => {
    if (connected && selectedAuthz.granter.length === 0) {
      if (address.length > 0 && chainInfo.config.currencies.length > 0) {
        fetchDetails(address);
      }
    }
  }, [address]);

  useEffect(() => {
    if (selectedAuthz.granter.length > 0) {
      fetchDetails(selectedAuthz.granter);
    } else if (address?.length > 0) {
      fetchDetails(address);
    }
  }, [selectedAuthz]);

  const fetchDetails = (address) => {
    dispatch(
      getBalance({
        baseURL: chainInfo.config.rest,
        address: address,
        denom: chainInfo.config.currencies[0].coinMinimalDenom,
      })
    );

    dispatch(
      getDelegations({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );

    dispatch(
      getDelegatorTotalRewards({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );

    dispatch(
      getUnbonding({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );
  };

  return (
    <>
      {connected ? (
        <BalanceInfo
          chainInfo={chainInfo}
          balance={available}
          delegations={delegated}
          rewards={pendingRewards}
          unbonding={unbondingDel}
          currencies={chainInfo.config.currencies}
        />
      ) : (
        <></>
      )}
    </>
  );
}
