type Props = {
  label: string;
};

export default function TestButton({ label }: Props) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
      {label}
    </button>
  );
}
