import React from "react";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { getTypeURLName, shortenAddress } from "../utils/util";
import { parseSpendLimit } from "../utils/denom";
import { getLocalTime } from "../utils/datetime";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { authzMsgTypes } from "../utils/authorizations";

const renderAuthorization = (authz, displayDenom) => {
  const { allowance, granter, grantee } = authz;
  switch (allowance["@type"]) {
    case "/cosmos.feegrant.v1beta1.BasicAllowance":
      return (
        <>
          <ul>
            <li className="inline-space-between">
              <Typography>Type</Typography>
              <Chip
                label={getTypeURLName(allowance["@type"])}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>Granter</Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>Grantee</Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>SpendLimit</Typography>
              <Typography>
                {allowance.spend_limit.length === 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                ) : (
                  `${parseSpendLimit(allowance.spend_limit)}${displayDenom}`
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Expiration</Typography>
              <Typography>
                {allowance.expiration ? (
                  getLocalTime(allowance.expiration)
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                )}
              </Typography>
            </li>
          </ul>
        </>
      );

    case "/cosmos.feegrant.v1beta1.PeriodicAllowance":
      return (
        <>
          <ul>
            <li className="inline-space-between">
              <Typography>Type</Typography>
              <Chip
                label={getTypeURLName(allowance["@type"])}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>Granter</Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>Grantee</Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>SpendLimit</Typography>
              <Typography>
                {allowance.basic.spend_limit.length === 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                ) : (
                  `${parseSpendLimit(
                    allowance.basic.spend_limit
                  )}${displayDenom}`
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Expiration</Typography>
              <Typography>
                {allowance.basic.expiration ? (
                  getLocalTime(allowance.basic.expiration)
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Period</Typography>
              {allowance?.period}
            </li>
            <li className="inline-space-between">
              <Typography>Period Spend Limit</Typography>
              {allowance.period_spend_limit.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(
                  allowance.period_spend_limit
                )}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography>Period Can Spend</Typography>
              {allowance.period_can_spend.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(allowance.period_can_spend)}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography>Period Reset</Typography>
              {getLocalTime(allowance.period_reset)}
            </li>
          </ul>
        </>
      );
    case "/cosmos.feegrant.v1beta1.FilteredAllowanceS":
      return (
        <>
          <ul>
            <li>
              <Typography>Type</Typography>
              <Typography>
                <Chip
                  label={getTypeURLName(authz["@type"])}
                  variant="filled"
                  size="medium"
                />
              </Typography>
            </li>
          </ul>
        </>
      );
    case "/cosmos.feegrant.v1beta1.AllowedMsgAllowance":
      return (
        <>
          <ul>
            <li>
              <Typography>Type</Typography>
              <Typography>
                <Chip
                  label={getTypeURLName(authz['allowance']["@type"])}
                  variant="filled"
                  size="medium"
                />
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Granter</Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography>Grantee</Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li>
              <Typography>Allowance Type</Typography>
              <Typography>
                <Chip
                  label={getTypeURLName(authz['allowance']['allowance']["@type"])}
                  variant="filled"
                  size="medium"
                />
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>SpendLimit</Typography>
              <Typography>
                {allowance?.allowance?.basic.spend_limit.length === 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                ) : (
                  `${parseSpendLimit(
                    allowance?.allowance?.basic.spend_limit
                  )}${displayDenom}`
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Expiration</Typography>
              <Typography>
                {allowance?.allowance?.basic.expiration ? (
                  getLocalTime(allowance?.allowance.basic.expiration)
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography>Period</Typography>
              {allowance?.allowance?.period}
            </li>
            <li className="inline-space-between">
              <Typography>Period Spend Limit</Typography>
              {allowance?.allowance?.period_spend_limit.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(
                  allowance?.allowance?.period_spend_limit
                )}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography>Period Can Spend</Typography>
              {allowance?.allowance?.period_can_spend.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(allowance?.allowance.period_can_spend)}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography>Period Reset</Typography>
              {getLocalTime(allowance?.allowance.period_reset)}
            </li>
            <li className="inline-space-between">
              <Typography>Messages</Typography>
              {
                allowance?.allowed_messages.map(m => (
                  <Chip
                    label={authzMsgTypes().map(a=>{
                      if(a.typeURL === m) {
                        return a.label
                      }
                    })}
                    variant="filled"
                    size="medium"
                  />
                ))
              }

            </li>
          </ul>
        </>
      );
    default:
      return <Typography>Not Supported</Typography>;
  }
};

export function FeegrantInfo(props) {
  const { onClose, open, displayDenom } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogContent style={{ margin: 24 }}>
        {renderAuthorization(props.authorization, displayDenom)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

FeegrantInfo.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  authorization: PropTypes.object.isRequired,
  displayDenom: PropTypes.string.isRequired,
};
