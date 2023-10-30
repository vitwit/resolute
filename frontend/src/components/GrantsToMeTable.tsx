"use client";
import { Divider, Pagination, PaginationItem } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CopyToClipboard } from "./CopyToClipboard";

const GrantsToMeTable = () => {
  const [grants, setGrants] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  return (
    <div>
      <table className="custom-table overflow-y-scroll">
        <thead className="custom-table-head">
          <tr className="text-left">
            <th className="w-1/5">Network</th>
            <th className="w-1/4">Grantee</th>
            <th className="w-1/4">Expiration</th>
            <th className="w-1/4">Details</th>
            <th className="w-1/5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {grants.map((grant, index) => (
            <tr key={index} className="">
              <td className="flex gap-2">
                <div className="bg-[#3C3047] rounded-full h-[40px] w-[40px] flex justify-center items-center">
                  <Image
                    src="./osmosis-logo.svg"
                    height={31}
                    width={31}
                    alt="osmosis-logo"
                  />
                </div>
                <div className="my-auto">Polkachu</div>
              </td>
              <td>
                <CopyToClipboard message="cosmos1enruju0dnejv8v.." />
              </td>
              <td>2023-09-13 16:54:54</td>
              <td>
                <div className="flex items-center space-x-2">
                  <div className="my-auto">cosmos1enruju0dnejv8v..</div>
                  <div>
                    <Image
                      src="/details.svg"
                      width={24}
                      height={24}
                      onClick={() => {
                        console.log("opened details...");
                      }}
                      className="cursor-pointer"
                      alt="copy..."
                    />
                  </div>
                </div>
              </td>
              <td>
                <button className="custom-btn">Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrantsToMeTable;
