import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

export interface NoDataProps {
  title: string;
  showAction: boolean;
  actionText: string;
  onAction: () => void;
}

export const NoData: React.FC<NoDataProps> = (props: NoDataProps) => {
  return (
    <Box
      sx={{
        justifyContent: "center",
        p: 2,
      }}
    >
      <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
        {props.title}
      </Typography>
      {props.showAction ? (
        <Button
          disableElevation
          sx={{
            textTransform: "none",
            mt: 2,
          }}
          size="small"
          variant="contained"
          onClick={() => props.onAction()}
        >
          {props.actionText}
        </Button>
      ) : null}
    </Box>
  );
};
