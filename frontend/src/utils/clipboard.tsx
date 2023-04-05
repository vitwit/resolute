import { Dispatch } from "react";
import { resetError, setError } from "../features/common/commonSlice";

export const copyToClipboard = (text: string, dispatcher: Dispatch<any>) => {
    navigator.clipboard.writeText(text).then(
      function () {
        dispatcher(
          setError({
            type: "success",
            message: "Copied to clipboard",
          })
        );
        setTimeout(() => {
          dispatcher(resetError());
        }, 1000);
      },
      function (err) {
        dispatcher(
          setError({
            type: "error",
            message: "Failed to copy",
          })
        );
        setTimeout(() => {
          dispatcher(resetError());
        }, 1000);
      }
    );
  };