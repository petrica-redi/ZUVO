import { verifyAdmin } from "@/lib/admin/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // We can add layout-specific checks or wrappers here
  return <>{children}</>;
}