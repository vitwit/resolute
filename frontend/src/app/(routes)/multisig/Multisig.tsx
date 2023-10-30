"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMultisigAccounts } from "../../../store/features/multisig/multisigSlice";
import { AppDispatch } from "../../../store/store";

const Multisig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const multisigAccounts = useSelector(
    (state: any) => state.multisig.multisigAccounts
  ); 

  useEffect(() => {
    dispatch(getMultisigAccounts("cosmos16wnk86wkfj7a84g4d7epa2mf7fk2g7cm0rljjm"));
  }, [dispatch]);
  return <div>{JSON.stringify(multisigAccounts)}</div>;
};

export default Multisig;
