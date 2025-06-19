import { Meta, StoryObj } from "@storybook/nextjs";
import { DateInput } from ".";

const meta: Meta<typeof DateInput> = {
  title: "Input/DateInput",
  component: DateInput,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof DateInput> = {
  args: {
    placeholder: "日付を選択",
  },
};
