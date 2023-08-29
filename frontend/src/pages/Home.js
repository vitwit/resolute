import React, { Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ActiveProposals from "./gov/ProposalsPage";
import StakingPage from "./staking/StakingPage";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Page404 from "./Page404";
import { useDispatch, useSelector } from "react-redux";
import OverviewPage from "./overview/OverviewPage";
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
import GroupPage from "./GroupPage";
import Group from "./group/Group";
import Policy from "./group/Policy";
import CreateProposal from "./group/CreateProposal";
import GroupProposal from "./group/Proposal";
import { resetDefaultState as distributionResetDefaultState } from "../features/distribution/distributionSlice";
import { resetDefaultState as stakingResetDefaultState } from "../features/staking/stakeSlice";
import { getAllTokensPrice } from "../features/common/commonSlice";
import Proposal from "./gov/chain/Proposal";
import AirdropEligibility from "./passage/AirdropEligibility";
import { FeegrantOverview } from "./feegrant/FeegrantOverview";
import { AuthzOverview } from "./authz/AuthzOverview";
import ConnectWallet from "../components/ConnectWallet";

export const ContextData = React.createContext();

const ALL_NETWORKS = [
  "",
  "transfers",
  "gov",
  "staking",
  "multisig",
  "authz",
  "feegrant",
  "groups",
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

export default function Home(props) {
  const authzEnabled = useSelector((state) => state.common.authzMode);
  const [value, setValue] = React.useState(0);
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork?.chainName.toLowerCase() || ""
  );
  const activeTab = useSelector((state) => state.common.activeTab);
  const [network, setNetwork] = React.useState(selectedNetwork);
  const networks = useSelector((state) => state.wallet.networks);
  const wallet = useSelector((state) => state.wallet);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const page = pathParts?.[pathParts?.length - 1];

  const authzTabs = useSelector((state) => state.authz.tabs);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 8) {
      if (selectedNetwork === "") navigate("/passage/airdrop-check");
      else navigate(`/${selectedNetwork.toLowerCase()}/airdrop-check`);
    } else if (newValue === 2) {
      if (selectedNetwork === "") navigate(ALL_NETWORKS[newValue]);
      else
        navigate(`${selectedNetwork.toLowerCase()}/${ALL_NETWORKS[newValue]}`);
    } else if (newValue === 0) {
      navigate(
        `${selectedNetwork ? selectedNetwork + "/overview" : ""}${
          ALL_NETWORKS[newValue]
        }`
      );
    } else if (newValue === 3 || newValue === 6 || newValue === 5) {
      navigate(
        `${selectedNetwork ? selectedNetwork + "/" : ""}${
          ALL_NETWORKS[newValue]
        }`
      );
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
    setValue(activeTab)
  }, [activeTab])

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="menu bar">
          <Tab
            label="Overview"
            {...a11yProps(0)}
            value={0}
            sx={{
              fontWeight: 600,
            }}
          />
          <Tab
            label="Transfers"
            {...a11yProps(1)}
            value={1}
            sx={{
              fontWeight: 600,
            }}
            disabled={authzEnabled && !authzTabs?.sendEnabled}
          />
          <Tab
            label="Governance"
            {...a11yProps(2)}
            value={2}
            sx={{
              fontWeight: 600,
            }}
            disabled={authzEnabled && !authzTabs?.govEnabled}
          />
          <Tab
            label="Staking"
            {...a11yProps(3)}
            value={3}
            sx={{
              fontWeight: 600,
            }}
            disabled={authzEnabled && !authzTabs?.stakingEnabled}
          />
          {!authzEnabled && !authzTabs?.multisigEnabled ? (
            <Tab
              label="Multisig"
              {...a11yProps(4)}
              value={4}
              sx={{
                fontWeight: 600,
              }}
            />
          ) : null}
          {!authzEnabled && (
            <Tab
              label="Authz"
              {...a11yProps(5)}
              value={5}
              sx={{
                fontWeight: 600,
              }}
            />
          )}
          <Tab
            label="Feegrant"
            {...a11yProps(6)}
            value={6}
            sx={{
              fontWeight: 600,
            }}
          />
          <Tab
            label="Groups"
            {...a11yProps(7)}
            value={7}
            sx={{
              fontWeight: 600,
            }}
            disabled={authzEnabled && !authzTabs?.groupsEnabled}
          />
          {!authzEnabled && selectedNetwork === "passage" ? (
            <Tab
              label="Airdrop"
              {...a11yProps(8)}
              value={8}
              sx={{
                fontWeight: 600,
              }}
            />
          ) : null}
        </Tabs>
      </Box>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <ContextData.Provider value={network} setNetwork={setNetwork}>
          {wallet.connected ? (
            <Routes>
              <Route path="/" element={<OverviewPage />}>
                <Route
                  path=":networkName/overview"
                  element={<OverviewPage />}
                />
              </Route>

              <Route path="/:networkName/transfers" element={<SendPage />} />

              <Route path="/transfers" element={<SendPage />} />

              <Route path="/authz" element={<AuthzOverview />} />

              <Route path="/:networkName/authz" element={<Authz />} />

              <Route path="/feegrant" element={<FeegrantOverview />} />

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

              <Route path="/:networkName/groups" element={<GroupPage />} />

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
                path="/:networkName/groups/create-group"
                element={<CreateGroupNewPage />}
              />

              <Route
                path="/:networkName/feegrant/new"
                element={<NewFeegrant />}
              />

              <Route path="/:networkName/authz/new" element={<NewAuthz />} />

              <Route path="/:networkName/groups/:id" element={<Group />} />

              <Route
                path="/:networkName/groups/:id/policies/:policyId"
                element={<Policy />}
              />

              <Route
                path="/:networkName/groups/:id/policies/:policyAddress/proposals"
                element={<CreateProposal />}
              />

              <Route
                path="/:networkName/groups/groups/:groupID/proposals/:id"
                element={<GroupProposal />}
              />
              <Route
                path="/:networkName/airdrop-check"
                element={<AirdropEligibility />}
              />

              <Route path="*" element={<Page404 />}></Route>
            </Routes>
          ) : (
            <ConnectWallet />
          )}
        </ContextData.Provider>
      </Box>
    </Box>
  );
}
