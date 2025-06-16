import React from "react";
import { Checkbox } from "./ui/base-checkbox";
import { Label } from "@/_components/ui/label";

type Props = {
  label?: string;
  id?: string;
};

export const BaseCheckbox = ({ label, id, ...props }: Props) => {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex gap-[4px]">
      <Checkbox id={inputId} {...props} />
      {label && <Label htmlFor={inputId}>{label}</Label>}
    </div>
  );
};
