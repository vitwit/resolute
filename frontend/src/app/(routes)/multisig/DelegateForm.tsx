"use client";
import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import Image from "next/image";

export default function DelegateForm() {
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
                  {...register("delegate", {
                    required: "delegate is required",
                  })}
                  type="text"
                  placeholder="Delegate"
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
              <div className="input-bold-label">Delegator</div>
              <div className="relative">
                <input
                  className="input-w-full"
                  {...register("Delegator", {
                    required: "Delegator is required",
                  })}
                  type="text"
                  placeholder="pasg1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltguyufwf"
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="input-bold-label">Validator</div>
              <div className="relative">
                <input
                  className="input-w-full"
                  {...register("validator", {
                    required: "validator is required",
                  })}
                  type="text"
                  placeholder="Enter here"
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <div className="input-bold-label">Amount to send</div>
                <div className="flex space-x-1">
                  <div className="text-[#B0B0B0]">Balance : </div>
                  <div className="text-sm"> 0 AKT</div>
                </div>
              </div>
              <div className="relative">
                <input
                  className="input-w-full"
                  {...register("Amount", {
                    required: "Amount is required",
                  })}
                  type="text"
                  placeholder="Enter here"
                />
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="flex custom-btn mt-10 h-10  mx-auto items-center justify-center"
          >
            <div className="input-bold-label  ">Add</div>
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="input-bold-label">Messages</div>
        <div className="text-[#B0B0B0]">Loris Ipsum....</div>
      </div>
    </div>
  );
}
