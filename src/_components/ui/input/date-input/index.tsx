import { BaseInput } from "../base-input";
import { cn } from "@/lib/utils";

// TODO placeholder問題どうにかする
export function DateInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col">
      <BaseInput
        icon="calendar"
        type="date"
        id="date-picker"
        defaultValue={new Date().toISOString().split("T")[0]}
        className={cn(
          `bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`,
          className
        )}
        {...props}
      />
    </div>
  );
}
