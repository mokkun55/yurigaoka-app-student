import React from "react";
import { Checkbox } from "../ui/base-checkbox";
import { Label } from "@/_components/ui/label";

type Props = {
  label?: string;
};

export const BaseCheckbox = ({ label, ...props }: Props) => {
  return (
    <div className="flex items-center gap-2" {...props}>
      <Label>
        <Checkbox />
        <span>{label}</span>
      </Label>
    </div>
  );
};
