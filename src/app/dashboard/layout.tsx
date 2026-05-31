import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardProvider } from "./layout/DashboardContext";
import DashboardLayoutClient from "./layout/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <DashboardProvider>
      <DashboardLayoutClient user={session!.user}>
        {children}
      </DashboardLayoutClient>
    </DashboardProvider>
  );
}
