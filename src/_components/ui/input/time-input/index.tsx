import { BaseInput } from "../base-input";

export function TimeInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col" {...props}>
      <BaseInput
        icon="clock"
        type="time"
        id="time-picker"
        step="600"
        defaultValue="00:00"
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}
