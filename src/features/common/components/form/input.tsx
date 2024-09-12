import {
  Input as LibInput,
  InputProps as LibInputProps,
} from "@/components/ui/input";
import React, { LegacyRef } from "react";

export type InputProps = LibInputProps & {
  error?: string;
};

const Input = React.forwardRef(
  (props: InputProps, ref: LegacyRef<HTMLInputElement>) => {
    return (
      <>
        <LibInput
          color={props.error ? "failure" : "gray"}
          error={props.error}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);

export default Input;
