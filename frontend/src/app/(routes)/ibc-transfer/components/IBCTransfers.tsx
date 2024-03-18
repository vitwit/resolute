'use client';
import { SquidWidget } from "@0xsquid/widget";
import { AppConfig } from "../../../../../node_modules/@0xsquid/widget/widget/core/types/config";
import React from 'react';


const IBCTransfers = () => {

  const config = {
    style: {
      neutralContent: "#9DA7B1",
      baseContent: "#FFFDFD",
      base100: "#434565",
      base200: "#202230",
      base300: "#161522",
      error: "#ED6A5E",
      warning: "#FFB155",
      success: "#62C555",
      primary: "#AB67CB",
      secondary: "#37394C",
      secondaryContent: "#B2BCD3",
      neutral: "#383A4C",
      roundedBtn: "24px",
      roundedBox: "20px",
      roundedDropDown: "0px",
      displayDivider: false,
      advanced: {
        transparentWidget: false,
        },
      },
    companyName: "Test Widget",
    integratorId: "example-swap-widget",
    slippage: 3,
    instantExec: true,
    infiniteApproval: false,
    apiUrl: "https://dev.api.0xsquid.com",
  } as AppConfig;

  return (
    
    <SquidWidget config={config} />)
  
};

export default IBCTransfers;
