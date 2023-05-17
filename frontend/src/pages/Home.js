import React, { lazy, Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Overview from "./Overview";
import ActiveProposals from "./gov/ActiveProposals";
import StakingPage from "./StakingPage";
import MultisigPage from "./MultisigPage";
import AuthzPage from "./AuthzPage";
import FeegrantPage from "./FeegrantPage";
import GroupPageV1 from "./GroupPageV1";
import { Routes, Route, useRoutes, useParams, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Page404 from "./Page404";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function getTabIndex(path) {
  if (path.includes("gov")) return 1;
  else if (path.includes("staking")) return 2;
  else if (path.includes("multisig")) return 3;
  else if (path.includes("authz")) return 4;
  else if (path.includes("feegrant")) return 5;
  else if (path.includes("daos")) return 6;
  else return 0;
}

export default function Home() {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="menu bar"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Governance" {...a11yProps(1)} />
          <Tab label="Staking" {...a11yProps(2)} />
          <Tab label="Multisig" {...a11yProps(3)} />
          <Tab label="Authz" {...a11yProps(4)} />
          <Tab label="Feegrant" {...a11yProps(5)} />
          <Tab label="DAOs" {...a11yProps(6)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={getTabIndex(location.pathname)}></TabPanel>

      <Routes>
        <Route
          path="/:networkName"

          element={
            <AuthzPage />
          }
        />
        <Route path="/:networkName/authz" element={
          <AuthzPage />
        } />

        <Route path="/:networkName/feegrant" element={
          <FeegrantPage />
        } />

        <Route path="/:networkName/gov" element={
          <ActiveProposals />
        } />

        <Route path="/:networkName/daos" element={
          <GroupPageV1 />
        } />

        <Route path="/:networkName/multisig" element={
          <MultisigPage />
        } />

        <Route path="/:networkName/staking" element={
          <StakingPage />
        } />




        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </Box>
  );
}
