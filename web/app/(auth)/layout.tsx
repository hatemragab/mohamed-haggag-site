export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="page-fade">{children}</main>;
}
