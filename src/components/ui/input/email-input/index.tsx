/* 
  メールアドレスなどの使い回されることが予想されるコンポーネントはコンポーネントを切る
  iconとかが場所ごとに変わるのを防ぐため
  storybookには追加しない
*/

import { BaseInput } from "../base-input";

type Props = {
  label: string;
  placeholder: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function EmailInput({ label, placeholder, ...props }: Props) {
  return (
    <BaseInput
      type="email"
      icon="mail"
      placeholder={placeholder}
      label={label}
      {...props}
    />
  );
}
