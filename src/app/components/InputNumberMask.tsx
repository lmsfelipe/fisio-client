import { Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

type TProps = {
  control: any;
  inputName: string;
  hasError: boolean;
  mask: string;
  label: string;
};

export function InputNumberMask({
  control,
  inputName,
  hasError,
  mask,
  label,
}: TProps) {
  return (
    <Controller
      name={inputName}
      control={control}
      render={({ field: { ref, ...rest } }) => (
        <PatternFormat
          isInvalid={hasError}
          format={mask}
          customInput={Input}
          getInputRef={ref}
          label={label}
          {...rest}
        />
      )}
    />
  );
}
