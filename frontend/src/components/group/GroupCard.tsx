import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import { shortenAddress } from "../../utils/util";
import { getFormatDate } from "../../utils/datetime";
import { useNavigate, useParams } from "react-router-dom";

interface GroupCardProps {
  group: any;
}

interface BoxTextProps {
  label: string;
  text: string;
}

const BoxText = ({ label, text }: BoxTextProps) => {
  return (
    <Box sx={{ display: "flex" }} component="div">
      <Typography
        width={"30%"}
        variant="body1"
        color="text.secondary"
        gutterBottom
        fontWeight={500}
      >
        {label}
      </Typography>
      <Typography
        gutterBottom
        variant="body1"
        fontWeight={500}
        color="text.primary"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = React.useState(false);
  const groupMetadata = JSON.parse(group.metadata)
  const { networkName } = useParams();
  return (
    <Paper elevation={0} variant="outlined" square>
      <CardContent
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
          textAlign: "left",
        }}
        onClick={() => navigate(`/${networkName}/daos/${group?.id}`)}
        component="div"
      >
        <Typography
          gutterBottom
          variant="h6"
          color="text.primary"
          fontWeight={500}
          component="span"
        >
          {!showFullText && groupMetadata?.name?.substring(0, 30)}
          {showFullText && groupMetadata?.name}
          {groupMetadata?.name?.length > 40 ? (
            <a
              onClick={() => setShowFullText(!showFullText)}
              href="javascript:void(0);"
            >
              {" "}
              {showFullText ? " ...show less" : " ...more"}
            </a>
          ) : null}
        </Typography>
        <BoxText label={"Admin"} text={shortenAddress(group?.admin, 19)} />
        <BoxText label={"Created At"} text={getFormatDate(group?.created_at)} />
        <BoxText label={"Total Weight"} text={group?.total_weight} />
      </CardContent>
    </Paper>
  );
}
