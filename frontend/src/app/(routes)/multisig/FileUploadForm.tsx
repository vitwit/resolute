"use client";
import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import Image from "next/image";

function FileUploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };
  return (
    <div className="space-y-10 p-6">
      <div className="space-y-6">
        <div className="font-bold">
          <h1>Transaction Messages</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <div className="w-full space-y-6 relative">
            <div className="w-full space-y-2">
              <div className="input-bold-label">Select transaction</div>
              <div className="relative">
                <input
                  className="input-w-full"
                  {...register("Select transaction", {
                    required: "Select transaction is required",
                  })}
                  type="text"
                  placeholder="Select Here"
                />
                <Image
                  src="/down-arrow-icon.svg"
                  width={24}
                  height={24}
                  alt="Down-Arrow-Icon"
                  className="absolute right-2 top-2 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <div className="input-bold-label">Upload</div>
                <div className="flex space-x-1">
                  <div className="">Download Template </div>
                  <div className="cursor-pointer underline"> here</div>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <input className="input-w-full h-[174px]" placeholder="" />
                  <div className="">
                    <div className="absolute left-2 top-2 ">
                      <Image
                        src="/upload.svg"
                        width={60}
                        height={60}
                        alt="upload"
                        className="cursor-pointer"
                      />
                      <p>Upload CSV file here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="space-y-6">
        <div className="input-bold-label">Messages</div>
        <div className="text-[#B0B0B0]">Loris Ipsum....</div>
      </div>
    </div>
  );
}

export default FileUploadForm;
