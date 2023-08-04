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
import { authzMsgTypes } from "../utils/authorizations";

const renderAuthorization = (authz, displayDenom, coinDecimals) => {
  const { allowance, granter, grantee } = authz;
  const PERIODIC_ALLOWANCE = "/cosmos.feegrant.v1beta1.PeriodicAllowance";
  const BASIC_ALLOWANCE = "/cosmos.feegrant.v1beta1.BasicAllowance";
  switch (allowance["@type"]) {
    case "/cosmos.feegrant.v1beta1.BasicAllowance":
      return (
        <>
          <ul>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Type
              </Typography>
              <Chip
                label={getTypeURLName(allowance["@type"])}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Granter
              </Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Grantee
              </Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                SpendLimit
              </Typography>
              <Typography>
                {allowance.spend_limit.length === 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                ) : (
                  `${parseSpendLimit(
                    allowance.spend_limit,
                    coinDecimals
                  )}${displayDenom}`
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Expiration
              </Typography>
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
              <Typography color="text.primary" gutterBottom>
                Type
              </Typography>
              <Chip
                label={getTypeURLName(allowance["@type"])}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Granter
              </Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Grantee
              </Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
              />
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                SpendLimit
              </Typography>
              <Typography>
                {allowance.basic.spend_limit.length === 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                ) : (
                  `${parseSpendLimit(
                    allowance.basic.spend_limit,
                    coinDecimals
                  )}${displayDenom}`
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Expiration
              </Typography>
              <Typography>
                {allowance.basic.expiration ? (
                  getLocalTime(allowance.basic.expiration)
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                )}
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Period
              </Typography>
              {allowance?.period}
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Period Spend Limit
              </Typography>
              {allowance.period_spend_limit.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(
                  allowance.period_spend_limit,
                  coinDecimals
                )}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Period Can Spend
              </Typography>
              {allowance.period_can_spend.length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
              ) : (
                `${parseSpendLimit(
                  allowance.period_can_spend,
                  coinDecimals
                )}${displayDenom}`
              )}
            </li>
            <li className="inline-space-between">
              <Typography color="text.primary" gutterBottom>
                Period Reset
              </Typography>
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
              <Typography color="text.primary" gutterBottom>
                Type
              </Typography>
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
              <Typography gutterBottom color="text.primary" variant="body1">
                Type
              </Typography>
              <Typography gutterBottom color="text.primary" variant="body2">
                <Chip
                  label={getTypeURLName(authz["allowance"]["@type"])}
                  variant="filled"
                  size="medium"
                />
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography gutterBottom color="text.primary" variant="body1">
                Granter
              </Typography>
              <Chip
                label={shortenAddress(granter, 21)}
                variant="filled"
                size="medium"
                sx={{
                  mt: 1,
                }}
              />
            </li>
            <li className="inline-space-between">
              <Typography gutterBottom color="text.primary" variant="body1">
                Grantee
              </Typography>
              <Chip
                label={shortenAddress(grantee, 21)}
                variant="filled"
                size="medium"
                sx={{
                  mt: 1,
                }}
              />
            </li>
            <li>
              <Typography gutterBottom color="text.primary" variant="body1">
                Allowance Type
              </Typography>
              <Typography>
                <Chip
                  label={getTypeURLName(
                    authz["allowance"]["allowance"]["@type"]
                  )}
                  variant="filled"
                  size="medium"
                  sx={{
                    mt: 1,
                  }}
                />
              </Typography>
            </li>
            <li className="inline-space-between">
              <Typography gutterBottom color="text.primary" variant="body1">
                Expiration
              </Typography>
              <Typography gutterBottom color="text.primary" variant="body2">
                {allowance?.allowance?.["@type"] === PERIODIC_ALLOWANCE &&
                allowance?.allowance?.basic?.expiration ? (
                  getLocalTime(allowance?.allowance?.basic?.expiration)
                ) : allowance?.allowance?.["@type"] === BASIC_ALLOWANCE &&
                  allowance?.allowance?.expiration ? (
                  getLocalTime(allowance?.allowance?.expiration)
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: "&infin;" }} />
                )}
              </Typography>
            </li>

            <li className="inline-space-between">
              <Typography gutterBottom color="text.primary" variant="body1">
                Messages
              </Typography>
              {allowance?.allowed_messages.map((m, i) => (
                <Chip
                  index={i}
                  label={authzMsgTypes().map((a) => {
                    if (a.typeURL === m) {
                      return a.label;
                    }
                  })}
                  sx={{
                    mr: 0.5,
                  }}
                  variant="filled"
                  size="medium"
                />
              ))}
            </li>
          </ul>
        </>
      );
    default:
      return <Typography>Not Supported</Typography>;
  }
};

export function FeegrantInfo(props) {
  const { onClose, open, displayDenom, coinDecimals } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogContent
        sx={{
          m: 3,
        }}
      >
        {renderAuthorization(props.authorization, displayDenom, coinDecimals)}
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
  coinDecimals: PropTypes.number.isRequired,
};
