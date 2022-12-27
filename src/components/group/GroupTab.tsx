import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
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
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TypeGroupTabItem {
  title: string;
  disabled: boolean;
}

interface GroupTabinterface {
  handleTabChange: (newValue: number) => number;
  tabs: TypeGroupTabItem[];
}

export default function GroupTab({ handleTabChange, tabs }: GroupTabinterface) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleTabChange(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="groups tabs">
          {tabs.map((t, index) => (
            <Tab
              sx={{
                padding: 2,
              }}
              label={t.title}
              disabled={t.disabled}
              key={index}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
