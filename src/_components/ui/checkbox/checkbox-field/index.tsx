import { Label } from "../../label";
import { Checkbox } from "../ui/base-checkbox";

type Props = {
  label: string;
};

export const CheckboxField = ({ label }: Props) => {
  return (
    <div className="flex items-center gap-2 border border-(--border-gray) rounded-md p-2">
      <Label className="w-full">
        <Checkbox className="border-black w-5 h-5" />
        <span>{label}</span>
      </Label>
    </div>
  );
};
