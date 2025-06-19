import { BaseInput } from "../base-input";

// TODO placeholder問題どうにかする
export function DateInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col" {...props}>
      <BaseInput
        icon="calendar"
        type="date"
        id="date-picker"
        defaultValue={new Date().toISOString().split("T")[0]}
        className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
      />
    </div>
  );
}
