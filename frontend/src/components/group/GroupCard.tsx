import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import Grid from "@mui/material/Grid";
import { getYearAndMonth } from "../../utils/datetime";
import { useNavigate, useParams } from "react-router-dom";

interface GroupCardProps {
  group: any;
}

export default function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const groupMetadata = JSON.parse(group.metadata);
  const { networkName } = useParams();

  return (
    <Paper
      sx={{
        p: 2,
      }}
      variant="outlined"
    >
      <Box
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
          textAlign: "left",
        }}
        onClick={() => navigate(`/${networkName}/groups/${group?.id}`)}
        component="div"
      >
        {
          groupMetadata?.name ?
            <>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  textAlign: "center"
                }}
              >
                {groupMetadata?.name}
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                color="text.secondary"
                sx={{
                  textAlign: "center"
                }}
                gutterBottom
              >
                Est.&nbsp;{getYearAndMonth(group?.created_at)}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "left"
                }}
                gutterBottom
              >
                {groupMetadata?.description}
              </Typography>
            </>

            :
            <>
              <Typography
                variant="body1"
                fontWeight={500}
                color="text.secondary"
                sx={{
                  textAlign: "center"
                }}
                gutterBottom
              >
                Est.&nbsp;{getYearAndMonth(group?.created_at)}
              </Typography>


            </>
        }
        <Grid container spacing={2}
        >
          <Grid item xs={6} md={6}>
            <Typography
              variant="caption"
              color="text.primary"
              fontWeight={600}
            >
              Version
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              &nbsp;&nbsp;{group?.version}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>

            <Typography
              variant="caption"
              color="text.primary"
              fontWeight={600}
            >
              Total Weight
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              &nbsp;&nbsp;{group?.total_weight}

            </Typography>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
}
