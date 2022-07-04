import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

export function drawerListItems(currentPath, onNavigate, showAirdrop) {
  return (
  <React.Fragment>
    <ListItemButton  onClick={() => onNavigate("/")} selected={currentPath === "/"} sx={{pb: 1, pt:0}}>
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
    <ListItemButton onClick={() => onNavigate("/staking")} selected={currentPath === "/staking"} sx={{pb: 1, pt:0}}>
      <ListItemIcon>
        <BarChartOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Staking" />
    </ListItemButton>
    <ListItemButton onClick={() => onNavigate("/governance")} selected={currentPath === "/governance"} sx={{pb: 1, pt:0}}>
      <ListItemIcon>
        <DocumentScannerOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Governance" />
    </ListItemButton>
    <ListItemButton onClick={() => onNavigate("/authz")} selected={currentPath === "/authz"} sx={{pb: 1, pt:0}}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Authz"/>
    </ListItemButton>
    <ListItemButton onClick={() => {}} disabled sx={{pb: 1, pt:0}}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Feegrant" secondary="coming soon" />
    </ListItemButton>

  { showAirdrop ?
    <ListItemButton onClick={() => onNavigate("/airdrop-check")} selected={currentPath === "/airdrop-check"} sx={{pb: 1, pt:0}}>
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
