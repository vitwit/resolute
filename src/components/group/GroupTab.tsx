import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Paper } from '@mui/material';

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
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface GroupTabinterface {
    handleTabChange: (newValue: number) => number;
    tabs: Array<[]>;
}

export default function GroupTab({ handleTabChange, tabs }: GroupTabinterface) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        handleTabChange(newValue)
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}
                    aria-label="basic tabs example">
                        
                    {
                        tabs.map((t, i) => (
                            <Tab sx={{
                                fontSize: 16,
                                padding: 3
                            }} label={t} {...a11yProps(i)} />
                        ))
                    }
                    {/* <Tab sx={{
                        fontSize: 16,
                        padding: 3
                    }} label="Created By Me" {...a11yProps(0)} />
                    <Tab sx={{
                        fontSize: 16,
                        padding: 3
                    }} label="Part of" {...a11yProps(1)} /> */}
                </Tabs>
            </Box>
        </Box>
    );
}
