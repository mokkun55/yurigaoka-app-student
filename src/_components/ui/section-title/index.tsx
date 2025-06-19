type Props = {
  title: string;
  isMargin?: boolean;
};

export default function SectionTitle({ title, isMargin = true }: Props) {
  return (
    <p
      className={`text-sm font-bold border-b border-(--border-gray) pb-1 ${
        isMargin ? "mt-4 mb-2" : ""
      }`}
    >
      {title}
    </p>
  );
}
