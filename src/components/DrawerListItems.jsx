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
import { useDispatch, useSelector } from "react-redux";
import { getNodeInfo } from "../features/node/nodeSlice";

export function DrawerListItems({ currentPath, onNavigate, showAirdrop }) {
  const dispatch = useDispatch();
  const [nodeDataInfo, setNodeDataInfo] = React.useState(false);

  const wallet = useSelector(state => state?.wallet);
  const { chainInfo } = wallet;
  var nodeInfo = useSelector(state => state?.node)
  console.log('wallle', wallet)

  if (nodeInfo) {
    nodeInfo = nodeInfo?.nodeInfo || nodeInfo
  }

  React.useEffect(() => {
    dispatch(getNodeInfo({ baseURL: chainInfo?.config?.rest }))
  }, [])

  React.useEffect(() => {
    let status =  nodeInfo
    console.log('status', status)
    if (status?.status === 'idle') {
      if (status?.data?.application_version) {
        let version = status?.data?.application_version?.version;
        console.log('Version-- ', version)
        if (version?.indexOf('46') >= 0) {
          setNodeDataInfo(true);
        } else setNodeDataInfo(false);
      }
    }
  }, [nodeInfo?.status])


  return (
    <>
      <ListItemButton
        onClick={() => onNavigate("/")}
        selected={currentPath === "/"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Overview" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/multisig")}
        selected={currentPath === "/multisig"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Multisig" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/staking")}
        selected={currentPath === "/staking"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Staking" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/governance")}
        selected={currentPath === "/governance"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DocumentScannerOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Governance" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/authz")}
        selected={currentPath === "/authz"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Authz" />
      </ListItemButton>
      <ListItemButton
        disabled={nodeDataInfo ? false : true}
        onClick={() => onNavigate("/feegrant")}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === "/feegrant"}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Feegrant"
          secondary={
            nodeDataInfo?.status === 'pending' ? 'Loading..' :
              !nodeDataInfo ? 'Not supported' :
                null
          } />
      </ListItemButton>
      <ListItemButton
        disabled={nodeDataInfo ? false : true}
        onClick={() => onNavigate("/group")}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === "/group"}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Groups"
          secondary={
            nodeDataInfo?.status === 'pending' ? 'Loading..' :
              !nodeDataInfo ? 'Not supported' :
                null
          } />
      </ListItemButton>

      {showAirdrop ? (
        <ListItemButton
          onClick={() => onNavigate("/airdrop-check")}
          selected={currentPath === "/airdrop-check"}
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
