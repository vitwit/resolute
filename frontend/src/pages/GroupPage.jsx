import React, { lazy, Suspense, useState } from "react";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupTab, { TabPanel } from "../components/group/GroupTab";
import CardSkeleton from "../components/group/CardSkeleton";
import { useSelector } from "react-redux";

const AdminGroupList = lazy(() => import("./group/AdminGroupList"));
const MemberGroupList = lazy(() => import("./group/MemberGroupList"));

export default function GroupPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (value) => {
    setTab(value);
  };

  const selectedNetwork = useSelector((state) => state.common.selectedNetwork.chainName).toLowerCase();

  const navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box
        component="div"
        sx={{
          textAlign: "right",
        }}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            navigateTo(`/${selectedNetwork}/daos/create-group`);
          }}
          sx={{
            textTransform: "none",
          }}
        >
          Create Group
        </Button>
      </Box>
      <Paper sx={{ mt: 2 }} variant={"outlined"} elevation={0}>
        <Box>
          <GroupTab
            tabs={[
              {
                disabled: false,
                title: "Created By me",
              },
              {
                disabled: false,
                title: "Part of",
              }
            ]}
            handleTabChange={handleTabChange}
          />

          <TabPanel value={tab} index={0} key="admin"
          >
            <Suspense fallback={<CardSkeleton />}>
              <AdminGroupList />
            </Suspense>
          </TabPanel>

          <TabPanel value={tab} index={1} key="member">
            <Suspense fallback={<CardSkeleton />} >
              <MemberGroupList />
            </Suspense>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
