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
import { useSelector } from "react-redux";
import SelectNetwork from "../components/common/SelectNetwork";

export const ContextData = React.createContext();

const ALL_NETWORKS = ["", "gov", "staking", "multisig", "authz", "feegrant", "daos"]

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
  const [network, setNetwork] = React.useState(null);
 
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const page = location.pathname.split('/')?.[location.pathname.split('/')?.length - 1]
  console.log(location.pathname.split("/"), {params}, page)

  const networks = useSelector((state) => state.wallet.networks);
  const chainIDs = Object.keys(networks);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`${network}/${ALL_NETWORKS[newValue]}`)
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
      <Box
        sx={{
          justifyContent: "end",
          display: "flex",
          mr: 1,
        }}
      >
        <SelectNetwork
          defaultNetwork="cosmoshub"
          networks={chainIDs.map(chain => networks[chain].network.config.chainName)}
          onSelect={(e) => {
            let n = e?.toLowerCase()
            setNetwork(n);
            navigate(`${n}/${ALL_NETWORKS[value]}`)
          }}
        />
      </Box>

      <ContextData.Provider value={network} setNetwork={setNetwork}>
        <Routes>
          <Route
            path="/:networkName"
            // element={
            //   <AuthzPage />
            // }
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
      </ContextData.Provider>
    </Box>
  );
}
