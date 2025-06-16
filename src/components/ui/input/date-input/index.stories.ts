import { Meta, StoryObj } from "@storybook/nextjs";
import { Calendar22 } from ".";

const meta: Meta<typeof Calendar22> = {
  title: "Input/DateInput",
  component: Calendar22,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof Calendar22> = {
  args: {
    label: "ラベル",
    placeholder: "日付を選択",
  },
};
