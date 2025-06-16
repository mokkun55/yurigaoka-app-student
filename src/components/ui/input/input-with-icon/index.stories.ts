import type { Meta, StoryObj } from "@storybook/nextjs";
import InputWithIcon from ".";

const meta: Meta<typeof InputWithIcon> = {
  title: "Input/InputWithIcon",
  component: InputWithIcon,
  tags: ["autodocs"],
  args: {
    icon: "smile",
    placeholder: "テキストを入力してください",
  },
};

export default meta;
type Story = StoryObj<typeof InputWithIcon>;
export const Default: Story = {
  args: {
    icon: "smile",
    placeholder: "テキストを入力してください",
  },
};
