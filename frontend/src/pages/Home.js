import React, { Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ActiveProposals from "./gov/ActiveProposals";
import StakingPage from "./StakingPage";
import AuthzPage from "./AuthzPage";
import FeegrantPage from "./FeegrantPage";
import GroupPageV1 from "./GroupPageV1";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Page404 from "./Page404";
import { useSelector } from "react-redux";
import OverviewPage from "./OverviewPage";
import SendPage from "./SendPage";
import ProposalInfo from "./gov/ProposalInfo";
import UnjailPage from "./slashing/UnjailPage";
import PageMultisig from "./multisig/PageMultisig";
import PageMultisigInfo from "./multisig/tx/PageMultisigInfo";
import PageCreateTx from "./multisig/tx/PageCreateTx";
import Feegrant from "./feegrant/Feegrant";
import CreateGroupNewPage from "./group/CreateGroup";

export const ContextData = React.createContext();

const ALL_NETWORKS = ["", "transfers", "gov", "staking", "multisig", "authz", "feegrant", "daos"]

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
  if (path.includes("transfers")) return 1;
  if (path.includes("gov")) return 2;
  else if (path.includes("staking")) return 3;
  else if (path.includes("multisig")) return 4;
  else if (path.includes("authz")) return 5;
  else if (path.includes("feegrant")) return 6;
  else if (path.includes("daos")) return 7;
  else return 0;
}

export default function Home() {
  const [value, setValue] = React.useState(0);
  const selectedNetwork = useSelector(state => state.common.selectedNetwork?.chainName || "")
  const [network, setNetwork] = React.useState(selectedNetwork);

  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split('/')?.[location.pathname.split('/')?.length - 1]

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0 || newValue === 2) {
      navigate(ALL_NETWORKS[newValue]);
    } else {
      if (selectedNetwork === "") {
        setNetwork("simapp");
        navigate(`simapp/${ALL_NETWORKS[newValue]}`);
      } else {
        navigate(`${selectedNetwork.toLowerCase()}/${ALL_NETWORKS[newValue]}`);
      }
    }
  };


  useEffect(() => {
    setValue(getTabIndex(page));
  }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="menu bar"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Transfers" {...a11yProps(1)} />
          <Tab label="Governance" {...a11yProps(2)} />
          <Tab label="Staking" {...a11yProps(3)} />
          <Tab label="Multisig" {...a11yProps(4)} />
          <Tab label="Authz" {...a11yProps(5)} />
          <Tab label="Feegrant" {...a11yProps(6)} />
          <Tab label="DAOs" {...a11yProps(7)} />
        </Tabs>
      </Box>

    <Box sx={{
      mt: 2,
    }}>
      <ContextData.Provider value={network} setNetwork={setNetwork}>
        <Routes>
          <Route
            path="/"
            element={
              <OverviewPage />
            }
          />

          <Route path="/:networkName/transfers" element={
            <SendPage />
          } />

          <Route path="/transfers" element={
            <SendPage />
          } />

          <Route path="/:networkName/authz" element={
            <AuthzPage />
          } />

          <Route path="/:networkName/feegrant" element={
            <Feegrant />
          } />

          <Route path="/gov" element={
            <ActiveProposals />
          } />

          <Route path="/:networkName/gov" element={
            <ActiveProposals />
          } />

          <Route
            path="/:networkName/proposals/:id"
            element={
              <Suspense fallback={<CircularProgress />}>
                <ProposalInfo />
              </Suspense>
            }
          ></Route>

          <Route path="/:networkName/daos" element={
            <GroupPageV1 />
          } />

          <Route path="/:networkName/multisig" element={
            <PageMultisig />
          } />

          <Route path="/:networkName/staking" element={
            <StakingPage />
          } />

          <Route path="/:networkName/multisig/:address/txs" element={
            <PageMultisigInfo />
          } />

          <Route path="/:networkName/multisig/:address/create-tx" element={
            <PageCreateTx />
          } />
          
          <Route path="/:networkName/slashing" element={
            <UnjailPage />
          } />

          <Route path="/:networkName/daos/create-group" element={
            <CreateGroupNewPage />
          } />


          <Route path="*" element={<Page404 />}></Route>
        </Routes>
      </ContextData.Provider>
      </Box>
    </Box>
  );
}
