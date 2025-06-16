import { BaseInput } from "../base-input";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

// Props型に...propsを許容するため、React.InputHTMLAttributes<HTMLInputElement>を継承
import React from "react";

type Props = {
  icon: IconName;
  placeholder: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// アイコンのサイズは24pxにする
// TODO iconSizeに基づいたpaddingを設定する
export default function InputWithIcon({ icon, placeholder, ...props }: Props) {
  return (
    <div className="relative">
      <BaseInput className="pr-[42px]" placeholder={placeholder} {...props} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <DynamicIcon name={icon} />
      </div>
    </div>
  );
}
