import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardProvider } from "./DashboardContext";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session) {
  //   redirect("/login");
  // }

  return (
    <DashboardProvider>
      <DashboardLayoutClient user={{ name: "ssf", email:  "fdfdfdf@gmai"}}>
        {children}
      </DashboardLayoutClient>
    </DashboardProvider>
  );
}
