import React, { lazy, Suspense, useState } from "react";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { groupStyles } from "./group/group-css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupTab, { TabPanel } from "../components/group/GroupTab";
import CardSkeleton from "../components/group/CardSkeleton";

const AdminGroupList = lazy(() => import('./group/AdminGroupList'))
const MemberGroupList = lazy(() => import('./group/MemberGroupList'))

export default function GroupPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (value) => {
    setTab(value);
  }

  const navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box
        component="div"
        sx={groupStyles.gp_main}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            navigateTo("/group/create-group");
          }}
          endIcon={
            <GroupAddIcon />
          }
          sx={groupStyles.t_transform_btn}
        >
          Create Group
        </Button>
      </Box>
      <Paper sx={{mt: 3}} variant={'outlined'} elevation={0}>
        <Box sx={groupStyles.btn_g_box}>
          <GroupTab tabs={['Created By me', 'Part of']} handleTabChange={handleTabChange} />

          <TabPanel value={tab} index={0}>
            <Suspense fallback={<CardSkeleton />}>
              <AdminGroupList />
            </Suspense>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Suspense fallback={<CardSkeleton />}>
              <MemberGroupList />
            </Suspense>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
