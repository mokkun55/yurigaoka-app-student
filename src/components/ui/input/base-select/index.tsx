import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
  id?: string;
};

export const BaseSelect = ({
  placeholder,
  options,
  label,
  id,
  ...props
}: Props) => {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div {...props} className="flex flex-col gap-[4px]">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Select>
        <SelectTrigger className="w-full" id={inputId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
