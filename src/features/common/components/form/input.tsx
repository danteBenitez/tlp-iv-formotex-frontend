import { TextInput, TextInputProps } from "flowbite-react";
import React, { LegacyRef } from "react";

export type InputProps = TextInputProps & {
  error?: string;
};

const Input = React.forwardRef(
  (props: InputProps, ref: LegacyRef<HTMLInputElement>) => {
    return (
      <TextInput
        color={props.error ? "failure" : "gray"}
        helperText={props.error}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Input;
