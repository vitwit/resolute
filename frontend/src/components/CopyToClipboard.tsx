"use client";
import Image from "next/image";
import React from "react";

export const CopyToClipboard = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="my-auto">cosmos1enruju0dnejv8v..</div>
      <div>
        <Image
          src="/copy.svg"
          width={24}
          height={24}
          onClick={() => {
            navigator.clipboard.writeText(message);
          }}
          className="cursor-pointer"
          alt="copy..."
        />
      </div>
    </div>
  );
};
