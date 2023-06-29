import React, { Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ActiveProposals from "./gov/ActiveProposals";
import StakingPage from "./StakingPage";
import GroupPageV1 from "./GroupPageV1";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Page404 from "./Page404";
import { useDispatch, useSelector } from "react-redux";
import OverviewPage from "./OverviewPage";
import SendPage from "./SendPage";
import UnjailPage from "./slashing/UnjailPage";
import PageMultisig from "./multisig/PageMultisig";
import PageMultisigInfo from "./multisig/tx/PageMultisigInfo";
import PageCreateTx from "./multisig/tx/PageCreateTx";
import Feegrant from "./feegrant/Feegrant";
import CreateGroupNewPage from "./group/CreateGroup";
import NewFeegrant from "./feegrant/NewFeegrant";
import { getFeegrant } from "../utils/localStorage";
import { setFeegrant as setFeegrantState } from "../features/common/commonSlice";
import Authz from "./authz/Authz";
import NewAuthz from "./authz/NewAuthz";
import StakingOverview from "./stakingOverview/StakingOverview";
import GroupPage from "./GroupPage";
import Group from "./group/Group";
import Policy from "./group/Policy";
import CreateProposal from "./group/CreateProposal";
import Proposal from "./group/Proposal";
import { resetDefaultState as distributionResetDefaultState } from "../features/distribution/distributionSlice";
import { resetDefaultState as stakingResetDefaultState } from "../features/staking/stakeSlice";
import { getAllTokensPrice } from "../features/common/commonSlice";
import GroupProposal from "./gov/Proposal";
import AirdropEligibility from "./passage/AirdropEligibility";

export const ContextData = React.createContext();

const ALL_NETWORKS = [
  "",
  "transfers",
  "gov",
  "staking",
  "multisig",
  "authz",
  "feegrant",
  "daos",
  "airdrop-check",
];

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
  else if (path.includes("airdrop-check")) return 8;
  else return 0;
}

export default function Home(props) {
  const { haveVoteGrants } = props;
  const authzEnabled = useSelector((state) => state.common.authzMode);
  const [value, setValue] = React.useState(0);
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork?.chainName || ""
  );
  const [network, setNetwork] = React.useState(selectedNetwork);
  const networks = useSelector((state) => state.wallet.networks);
  const wallet = useSelector((state) => state.wallet);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const page = pathParts?.[pathParts?.length - 1];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 8) {
      navigate("/airdrop-check");
    } else if (newValue === 0 || newValue === 2 || newValue === 3) {
      navigate(ALL_NETWORKS[newValue]);
    } else {
      if (selectedNetwork === "") {
        setNetwork("cosmoshub");
        navigate(`cosmoshub/${ALL_NETWORKS[newValue]}`);
      } else {
        navigate(`${selectedNetwork.toLowerCase()}/${ALL_NETWORKS[newValue]}`);
      }
    }
  };

  // set the defaultState for each chain in staking and distribution to avoid errors when accessing chain Specific details
  useEffect(() => {
    dispatch(stakingResetDefaultState(Object.keys(networks)));
    dispatch(distributionResetDefaultState(Object.keys(networks)));
    dispatch(getAllTokensPrice());
  }, [wallet]);

  //get the feegrant details from localstorage for the selectedNetwork and set
  // into the common slice feegrant
  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[selectedNetwork.toLowerCase()];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: selectedNetwork.toLowerCase(),
      })
    );
  }, [selectedNetwork, page]);

  useEffect(() => {
    setValue(getTabIndex(page));
  }, []);

  useEffect(() => {
    const chainIds = Object.keys(wallet.networks);
    dispatch(stakingResetDefaultState(chainIds));
  }, [wallet]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="menu bar">
          <Tab label="Overview" {...a11yProps(0)} value={0} />
          <Tab label="Transfers" {...a11yProps(1)} value={1} />
          <Tab
            label="Governance"
            {...a11yProps(2)}
            value={2}
            disabled={authzEnabled && !haveVoteGrants}
          />
          <Tab label="Staking" {...a11yProps(3)} value={3} />
          {!authzEnabled && (
            <Tab label="Multisig" {...a11yProps(4)} value={4} />
          )}
          {!authzEnabled && <Tab label="Authz" {...a11yProps(5)} value={5} />}
          <Tab label="Feegrant" {...a11yProps(6)} value={6} />
          <Tab label="DAOs" {...a11yProps(7)} value={7} />
          {!authzEnabled && <Tab label="Airdrop" {...a11yProps(8)} value={8} />}
        </Tabs>
      </Box>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <ContextData.Provider value={network} setNetwork={setNetwork}>
          <Routes>
            <Route path="/" element={<OverviewPage />}>
              <Route path=":networkName/overview" element={<OverviewPage />} />
            </Route>

            <Route path="/:networkName/transfers" element={<SendPage />} />

            <Route path="/transfers" element={<SendPage />} />

            <Route path="/:networkName/authz" element={<Authz />} />

            <Route path="/:networkName/feegrant" element={<Feegrant />} />

            <Route path="/staking" element={<StakingPage />} />

            <Route path="/:networkName/staking" element={<StakingPage />} />

            <Route path="/gov" element={<ActiveProposals />} />

            <Route path="/:networkName/gov" element={<ActiveProposals />} />

            <Route
              path="/:networkName/proposals/:id"
              element={
                <Suspense fallback={<CircularProgress />}>
                  <Proposal />
                </Suspense>
              }
            ></Route>

            <Route path="/:networkName/daos" element={<GroupPageV1 />} />

            <Route path="/:networkName/multisig" element={<PageMultisig />} />

            <Route
              path="/:networkName/multisig/:address/txs"
              element={<PageMultisigInfo />}
            />

            <Route
              path="/:networkName/multisig/:address/create-tx"
              element={<PageCreateTx />}
            />

            <Route path="/:networkName/slashing" element={<UnjailPage />} />

            <Route
              path="/:networkName/daos/create-group"
              element={<CreateGroupNewPage />}
            />

            <Route
              path="/:networkName/feegrant/new"
              element={<NewFeegrant />}
            />

            <Route path="/:networkName/authz/new" element={<NewAuthz />} />

            <Route path="/:networkName/daos/:id" element={<Group />} />

            <Route
              path="/:networkName/daos/:id/policies/:policyId"
              element={<Policy />}
            />

            <Route
              path="/:networkName/daos/:id/policies/:policyAddress/proposals"
              element={<CreateProposal />}
            />

            <Route path="/daos" element={<GroupPage />} />

            <Route
              path="/:networkName/daos/proposals/:id"
              element={<GroupProposal />}
            />
            <Route path="/airdrop-check" element={<AirdropEligibility />} />

            <Route path="*" element={<Page404 />}></Route>
          </Routes>
        </ContextData.Provider>
      </Box>
    </Box>
  );
}
