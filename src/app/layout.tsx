import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triplit",
  description: "Triplit easy to share.",
  icons: {
    icon: '/icon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`text-[12px]`}
    >
      <body
        cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
