import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function Textarea({
  className,
  id,
  label,
  ...props
}: React.ComponentProps<"textarea"> & {
  label?: string;
  id?: string;
}) {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex flex-col gap-[4px]">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <textarea
        id={inputId}
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Textarea };
