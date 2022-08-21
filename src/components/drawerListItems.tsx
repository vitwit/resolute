import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export function drawerListItems(
  currentPath: string,
  routeName: string,
  onNavigate: (path: string) => void,
  showAirdrop: boolean
) {
  return (
    <>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}`)}
        selected={currentPath === `/${routeName}`}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}/multisig`)}
        selected={currentPath === `/${routeName}/multisig`}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Multisig" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}/staking`)}
        selected={currentPath === `/${routeName}/staking`}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Staking" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}/governance`)}
        selected={currentPath === `/${routeName}/governance`}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DocumentScannerOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Governance" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}/authz`)}
        selected={currentPath === `/${routeName}/authz`}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Authz" />
      </ListItemButton>
      <ListItemButton
        disabled
        onClick={() => onNavigate(`/${routeName}/feegrant`)}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === `/${routeName}/feegrant`}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Feegrant" secondary="coming soon" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate(`/${routeName}/group`)}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === `/${routeName}/group`}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Groups" />
      </ListItemButton>

      {showAirdrop ? (
        <ListItemButton
          onClick={() => onNavigate(`/${routeName}/airdrop-check`)}
          selected={currentPath === `/${routeName}/airdrop-check`}
          sx={{ pb: 0.5, pt: 0.5 }}
        >
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Airdrop" />
        </ListItemButton>
      ) : (
        <></>
      )}
    </>
  );
}
