import React, { lazy } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Overview from "./Overview";
import ActiveProposals from "./gov/ActiveProposals";

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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const [value, setValue] = React.useState(0);

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
      <TabPanel value={value} index={0}>
        {/* <Overview />   */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActiveProposals />
      </TabPanel>
    </Box>
  );
}
