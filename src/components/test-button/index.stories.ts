import type { Meta, StoryObj } from "@storybook/nextjs";
import TestButton from ".";

const meta: Meta<typeof TestButton> = {
  title: "TestButton",
  component: TestButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TestButton>;

export const Default: Story = {
  args: {
    label: "ボタン",
  },
};
