import { verifyAdmin } from "@/lib/admin/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyAdmin();
  return <>{children}</>;
}
