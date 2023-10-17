"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function Feegrants() {
  const [value, setValue] = React.useState("granted-to-me");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  const tabStyle = {
    textTransform: "none",
    color: "rgba(176, 176, 176, 0.50)", // Change the text color to black when selected
    fontFamily: "inter",
    paddingX: "40px",
    marginX: "20px",

    paddingY: "0px",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "12px",
    "&.Mui-selected": {
      color: "white",
      fontWeight: 700,
    },
  };
  return (
    <>
      <div className="w-full flex justify-center">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="feegrant tabs"
        >
          <Tab sx={tabStyle} value={"granted-by-me"} label="Granted By Me" />
          <Tab sx={tabStyle} value={"create"} label="Create new Grant" />
          <Tab sx={tabStyle} value={"granted-to-me"} label="Granted To Me" />
        </Tabs>
      </div>
    </>
  );
}
