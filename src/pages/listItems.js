import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

export function mainListItems(onNavigate, showAirdrop) {
  return (
  <React.Fragment>
    <ListItemButton onClick={() => onNavigate("/")}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    {/* <ListItemButton onClick={() => onNavigate("/send")}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Send" />
    </ListItemButton> */}
    <ListItemButton onClick={() => onNavigate("/validators")}>
      <ListItemIcon>
        <BarChartOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Staking" />
    </ListItemButton>
    <ListItemButton onClick={() => onNavigate("/proposals")}>
      <ListItemIcon>
        <DocumentScannerOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Proposals" />
    </ListItemButton>
    <ListItemButton onClick={() => {}} disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Authz" secondary="coming soon" />
    </ListItemButton>
    <ListItemButton onClick={() => {}} disabled>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Feegrant" secondary="coming soon" />
    </ListItemButton>

  { showAirdrop ?
    <ListItemButton onClick={() => onNavigate("/airdrop-check")}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Airdrop" />
    </ListItemButton>

    :
    <></>
  }
  </React.Fragment >
);
}
