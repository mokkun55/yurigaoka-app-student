import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

type Props = {
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
  id?: string;
};

export const BaseSelect = ({ placeholder, options, ...props }: Props) => {
  return (
    <div {...props} className="flex flex-col gap-[4px]">
      <Select>
        <SelectTrigger className="w-full">
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
