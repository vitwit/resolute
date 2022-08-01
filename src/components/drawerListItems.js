import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

export function drawerListItems(currentPath, onNavigate, showAirdrop) {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => onNavigate("/")} selected={currentPath === "/"} sx={{ pb: 0.5, pt: 0.5 }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate("/multisig")} selected={currentPath === "/multisig"} sx={{ pb: 0.5, pt: 0.5 }}>
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Multisig" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate("/staking")} selected={currentPath === "/staking"} sx={{ pb: 0.5, pt: 0.5 }}>
        <ListItemIcon>
          <BarChartOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Staking" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate("/governance")} selected={currentPath === "/governance"} sx={{ pb: 0.5, pt: 0.5 }}>
        <ListItemIcon>
          <DocumentScannerOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Governance" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate("/authz")} selected={currentPath === "/authz"} sx={{ pb: 0.5, pt: 0.5 }}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Authz" />
      </ListItemButton>
      <ListItemButton onClick={() => onNavigate("/feegrant")} sx={{ pb: 0.5, pt: 0.5 }} selected={currentPath === "/feegrant"}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Feegrant" />
      </ListItemButton>

      {showAirdrop ?
        <ListItemButton onClick={() => onNavigate("/airdrop-check")} selected={currentPath === "/airdrop-check"} sx={{ pb: 0.5, pt: 0.5 }}>
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
