"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/_components/ui/button";
import { Calendar } from "@/_components/ui/calendar";
import { Label } from "@/_components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
};

export function Calendar22({ id, label, placeholder, ...props }: Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div {...props} className="flex flex-col gap-[4px]">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={inputId}
            className="justify-between font-normal w-full"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
