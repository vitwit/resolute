import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Button from "@mui/material/Button";
import { drawerListItems } from "./drawerListItems";
import { totalBalance } from "../utils/denom";
import { shortenAddress, shortenPubKey } from "../utils/util";
import { useLocation } from "react-router-dom";
import { getNetworkInfo, Network } from "../utils/networks";

export interface AppDrawerProps {
  wallet: any;
  onDisconnectWallet: () => void;
  onNavigate: (path: string) => void;
  onConnectWallet: (selectedNetwork: any) => void;
  selectedNetwork: string;
  balance: any;
  chainInfo: any;
  onCopy: (data: string) => void;
  selectedAuthz: any;
}

const drawerWidth = 210;
export default function AppDrawer(props: AppDrawerProps) {
  const {
    wallet,
    onDisconnectWallet,
    onNavigate,
    onConnectWallet,
    balance,
    chainInfo,
    onCopy,
  } = props;

  const network = getNetworkInfo(props.selectedNetwork);
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ["& .MuiDrawer-paper::-webkit-scrollbar"]: {
          display: "none",
        },
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          scrollbarWidth: "none",
        },
      }}
    >
      {props.selectedAuthz.granter.length > 0 ? (
        <>
          <Toolbar />
          <Toolbar />
        </>
      ) : (
        <Toolbar />
      )}

      <List>
        {wallet.connected ? (
          <>
            <ListItem
              style={{ justifyContent: "left" }}
              sx={{ pb: 0.5, pt: 0.5 }}
            >
              <AccountBalanceWalletOutlinedIcon />
              &nbsp;
              <Typography
                color="text.primary"
                variant="body1"
                fontWeight={500}
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                }}
              >
                {wallet.name}
              </Typography>
            </ListItem>
            <ListItem sx={{ pb: 0.5, pt: 0.5 }}>
              <Chip
                label={shortenAddress(wallet.address, 21)}
                size="small"
                deleteIcon={<ContentCopyOutlined />}
                onDelete={() => {
                  onCopy(wallet.address);
                }}
              />
            </ListItem>
            <ListItem sx={{ pb: 0.5, pt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                PubKey
              </Typography>
            </ListItem>
            <ListItem sx={{ pt: 0.5 }}>
              <Chip
                label={wallet.pubKey ? shortenPubKey(wallet.pubKey, 21) : ""}
                size="small"
                deleteIcon={<ContentCopyOutlined />}
                onDelete={() => {
                  onCopy(wallet.pubKey);
                }}
              />
            </ListItem>
            <ListItem sx={{ pb: 0, pt: 0.5 }}>
              <Typography
                color="text.secondary"
                variant="caption"
                fontWeight={400}
              >
                Available Balance
              </Typography>
            </ListItem>
            <ListItem sx={{ pb: 0.5, pt: 0 }}>
              <Typography color="text.primary" variant="body2">
                {totalBalance(
                  balance.balance,
                  chainInfo.config.currencies[0].coinDecimals
                )}
                &nbsp;{chainInfo.config.currencies[0].coinDenom}
              </Typography>
            </ListItem>
            <ListItem
              style={{ justifyContent: "center" }}
              sx={{ pb: 0.5, pt: 0 }}
            >
              <Button
                endIcon={<LogoutOutlinedIcon />}
                size="small"
                variant="outlined"
                style={{ textTransform: "capitalize" }}
                disableElevation
                onClick={() => onDisconnectWallet()}
              >
                Disconnect
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem sx={{ pb: 0.5, pt: 0.5 }} />
            <ListItem sx={{ pb: 0.5, pt: 0.5 }} />
            <ListItem sx={{ pb: 0.5, pt: 0.5 }} />
            <ListItem
              style={{ justifyContent: "center" }}
              sx={{ pb: 0.5, pt: 0.5 }}
            >
              <Button
                startIcon={<AccountBalanceWalletOutlinedIcon />}
                size="small"
                variant="contained"
                disableElevation
                onClick={() => onConnectWallet(network)}
              >
                Connect Wallet
              </Button>
            </ListItem>
          </>
        )}
      </List>
      {network ? (
        <>
          <Divider />
          <List>
            {drawerListItems(
              location.pathname,
              network.routeName,
              (path: string): void => {
                onNavigate(path);
              },
              network.showAirdrop
            )}
          </List>
        </>
      ) : (
        <></>
      )}
    </Drawer>
  );
}
