export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex justify-center p-3 bg-white">
      {children}
    </div>
  );
}
