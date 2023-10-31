"use client";

import React, { useState, useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import Image from "next/image";
import "./style.css";

export default function CreateMultisigForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const [additionalMembers, setAdditionalMembers] = useState<string[]>([]);
  const [additionalInputValue, setAdditionalInputValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (additionalMembers.length === 7) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [additionalMembers]);

  const onSubmit = async (data: FieldValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };

  const handleAddMemberClick = () => {
    if (additionalMembers.length < 7) {
      setAdditionalMembers([...additionalMembers, additionalInputValue]);
      setAdditionalInputValue("");
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...additionalMembers];
    updatedMembers.splice(index, 1);
    setAdditionalMembers(updatedMembers);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <div className="space-y-6">
        <div className="w-full space-y-2">
          <div className="input-bold-label">Name</div>
          <input
            className="input-w-full"
            {...register("MultisigName-type", {
              required: "MultisigName  is required",
            })}
            type="text"
            placeholder="Enter Here"
          />
        </div>
        <div className="w-full space-y-2 relative">
          <div className="input-bold-label">Members</div>
          <div className="flex">
            <input
              className="input-w-full pr-10"
              {...register("MultisigName-type", {
                required: "MultisigNameis required",
              })}
              type="text"
              placeholder="Add public key here"
              value={additionalInputValue}
              onChange={(e) => setAdditionalInputValue(e.target.value)}
            />
            <Image
              src="/Delete-Forever.svg"
              width={24}
              height={24}
              alt="Delete-Forever-logo"
              className="absolute right-2 top-10 cursor-pointer"
            />
          </div>
        </div>
        {additionalMembers.map((member, index) => (
          <div key={index} className="w-full space-y-2 relative">
            <div className="flex">
              <input
                className="input-w-full pr-10"
                type="text"
                placeholder="Add public key here"
                value={member}
                disabled
              />
              <Image
                src="/Delete-Forever.svg"
                width={24}
                height={24}
                alt="Delete-Forever-logo"
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => handleRemoveMember(index)}
              />
            </div>
          </div>
        ))}
        <div>
          <button
            disabled={isSubmitting || additionalMembers.length >= 7}
            type="button"
            className="flex custom-btn h-10 items-center justify-center"
            onClick={handleAddMemberClick}
          >
            <div className="input-bold-label">Add Member</div>
          </button>
        </div>
        {showAlert && (
          <div className="w-full space-y-2 relative">
            <div className="alert-message">
              You have added 7 members. No more members can be added.
            </div>
          </div>
        )}
        {additionalMembers.length > 0 && additionalMembers.length < 7 && (
          <div className="w-full space-y-2 relative">
            <div className="input-bold-label">
              Threshold Signature required to send a transaction
            </div>
            <div className="flex flex-row">
              <div className="drop-box">1</div>
              <div className="flex items-center px-6">of</div>
              <div className="drop-box">1</div>
            </div>
          </div>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className="flex custom-btn w-full mt-10 h-10 items-center justify-center"
        >
          <div className="input-bold-label">Create</div>
        </button>
      </div>
    </form>
  );
}
