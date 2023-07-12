import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GroupList from "../../components/group/GroupList";
import { getGroupsByMember } from "../../features/group/groupSlice";
import { PER_PAGE } from "./common";

function MemberGroupList() {
  const [memberTotal, setMemberTotal] = useState(0);
  const dispatch = useDispatch();

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[currentNetwork]
  const address =
    networks[chainID]?.walletInfo.bech32Address;

  const chainInfo = networks[chainID]?.network;

  const groups = useSelector((state) => state.group.groups?.[chainID]);

  const fetchGroupsByMember = (offset = 0, limit = PER_PAGE) => {
    dispatch(
      getGroupsByMember({
        baseURL: chainInfo?.config?.rest,
        address: address,
        pagination: {
          offset,
          limit,
        },
        chainID: chainID,
      })
    );
  };

  const handlePagination = (page) => {
    fetchGroupsByMember(page, PER_PAGE);
  };

  useEffect(() => {
    if (params?.networkName?.length > 0) setCurrentNetwork(params.networkName);
    else setCurrentNetwork("cosmoshub");
  }, [params]);

  useEffect(() => {
    fetchGroupsByMember(0, PER_PAGE);
  }, [chainInfo, address]);

  useEffect(() => {
    if (Number(groups?.member?.pagination?.total))
      setMemberTotal(Number(groups?.member?.pagination?.total));
  }, [groups?.member?.pagination?.total]);

  return (
    <GroupList
      total={memberTotal}
      handlePagination={handlePagination}
      paginationKey={groups?.member?.pagination?.next_key}
      groups={groups?.member?.list}
      status={groups?.member?.status}
      notFoundText="Not part of any group"
      showNotFoundAction={false}
    />
  );
}

export default MemberGroupList;
