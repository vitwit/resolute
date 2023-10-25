"use client";

import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import { Label } from "@mui/icons-material";

export default function NewBasicGrant() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    // TODO: submit to server
    // ...
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <div className="w-full space-y-2 mb-6">
        <div className="input-bold-label">Grant type</div>
        <input
          className="input-w-full"
          {...register("grant-type", {
            required: "Grant type is required",
          })}
          type="text"
          placeholder="Grant Type (multiselect to be done)"
        />
      </div>
      <div className="flex gap-6">
        <div className="w-full space-y-2">
          <div className="input-bold-label">Grantee</div>
          <input
            className="input-w-full"
            {...register("grantee", {
              required: "Grantee is required",
            })}
            type="text"
            placeholder="grantee"
          />
        </div>
        <div className="w-full space-y-2">
          <div className="input-bold-label">Expiration Date</div>
          <input
            className="input-w-full"
            {...register("Expiration-date", {
              required: "Expiration date is required",
            })}
            type="date"
            placeholder="Expiration date"
          />
        </div>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="flex custom-btn mt-10 h-10 items-center justify-center"
      >
        <div className="input-bold-label">Grant</div>
      </button>
    </form>
  );
}
