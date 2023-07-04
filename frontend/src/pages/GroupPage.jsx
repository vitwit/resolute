import React, { lazy, Suspense, useEffect, useState } from "react";
import Box from "@mui/system/Box";
import { Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import GroupTab, { TabPanel } from "../components/group/GroupTab";
import CardSkeleton from "../components/group/CardSkeleton";
import { useSelector } from "react-redux";
import SelectNetwork from "../components/common/SelectNetwork";

const AdminGroupList = lazy(() => import("./group/AdminGroupList"));
const MemberGroupList = lazy(() => import("./group/MemberGroupList"));

export default function GroupPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (value) => {
    if (value === 2) {
      navigateTo(`/${currentNetwork}/daos/create-group`);
    } else {
      setTab(value);
    }
  };

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  useEffect(() => {
    if (params?.networkName?.length > 0) setCurrentNetwork(params.networkName);
    else setCurrentNetwork("cosmoshub");
  }, [params]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          p: 1,
        }}
        component="div"
      >
        <SelectNetwork
          onSelect={(name) => {
            navigate(`/${name}/daos`);
          }}
          networks={Object.keys(nameToChainIDs)}
          defaultNetwork={currentNetwork.toLowerCase().replace(/ /g, "")}
        />
      </Box>

      <Paper sx={{ mt: 1 }} variant={"outlined"} elevation={0}>
        <GroupTab
          tabs={[
            {
              disabled: false,
              title: "Created By me",
            },
            {
              disabled: false,
              title: "Part of",
            },
            {
              disabled: false,
              title: "Create group",
            },
          ]}
          handleTabChange={handleTabChange}
        />

        <TabPanel value={tab} index={0} key="admin">
          <Suspense fallback={<CardSkeleton />}>
            <AdminGroupList />
          </Suspense>
        </TabPanel>

        <TabPanel value={tab} index={1} key="member">
          <Suspense fallback={<CardSkeleton />}>
            <MemberGroupList />
          </Suspense>
        </TabPanel>
      </Paper>
    </>
  );
}
