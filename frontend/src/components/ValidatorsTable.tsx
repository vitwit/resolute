"use client";
import { Divider, Pagination, PaginationItem } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ValidatorsTable = () => {
  const [validators, setValidators] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [slicedValidators, setSlicedValidators] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;
  useEffect(() => {
    if (validators.length < PER_PAGE) {
      setSlicedValidators(validators);
    } else {
      setCurrentPage(1);
      setSlicedValidators(validators?.slice(0, 1 * PER_PAGE));
    }
  }, [validators]);
  return (
    <div>
      <table className="customTable overflow-y-scroll">
        <thead className="customTableHead">
          <tr className="text-left">
            <th>Rank</th>
            <th>Validator</th>
            <th>Voting Power</th>
            <th>Status</th>
            <th>Commission</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slicedValidators.map((item, index) => (
            <tr key={index} className="">
              <td>01</td>
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
              <td>11,242,352,314</td>
              <td>
                <div className="flex items-center">
                  {item % 3 !== 0 ? (
                    <>
                      <span className="pl-2 pr-1">
                        <Image
                          className="inline"
                          src="./active-icon.svg"
                          width={16}
                          height={16}
                          alt="Price drop"
                        />
                      </span>
                      <span className="text-[#2DC5A4] text-[14px] leading-3">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="pl-2 pr-1">
                        <Image
                          className="inline"
                          src="./jailed-icon.svg"
                          width={16}
                          height={16}
                          alt="Price drop"
                        />
                      </span>
                      <span className="text-[#E57575] text-[14px] leading-3">
                        Jailed
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td>20%</td>
              <td>
                <button className="customBtn">Claim</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {validators.length > 0 ? (
        <div className="flex justify-end">
          <Pagination
            sx={{
              mt: 1,
            }}
            count={Math.ceil(validators.length / PER_PAGE)}
            shape="circular"
            onChange={(_, v) => {
              setCurrentPage(v);
              setSlicedValidators(
                validators?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
              );
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ValidatorsTable;
