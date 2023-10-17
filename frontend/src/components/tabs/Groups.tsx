"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function Groups() {
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
          aria-label="groups tabs"
        >
          <Tab sx={tabStyle} value={"cranted-by-me"} label="Created by me" />
          <Tab sx={tabStyle} value={"create"} label="Create new group" />
          <Tab sx={tabStyle} value={"other-groups"} label="Other Groups" />
        </Tabs>
      </div>
    </>
  );
}
