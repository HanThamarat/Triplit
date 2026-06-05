import type { Metadata } from "next";
import { Hanken_Grotesk, Young_Serif, Caveat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/i18n/LanguageProvider";
import ReduxProvider from "@/lib/reduxProvider";

// Body + UI everywhere. Friendly, highly legible grotesk (replaces the
// previously doubled DM Sans, which loaded the same family for both roles).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Landing display voice: warm, chunky, organic serif (travel-journal feel).
const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young",
  display: "swap",
});

// Hand-written accent, used sparingly for the "money note" annotations.
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Triplit — Plan Trips, Chat AI, Split Expenses",
  description: "Experience effortless travel planning, smart AI itineraries, and instant peer expense splitting with your friends on Triplit.",
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
      className={`${hanken.variable} ${youngSerif.variable} ${caveat.variable} text-[14px] antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('triplit_theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen bg-[#F8FAFD] text-slate-900 dark:bg-[#0A0A0F] dark:text-stone-100 transition-colors duration-500" cz-shortcut-listen="true">
        <LanguageProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </LanguageProvider>
      </body>
      <Analytics />
    </html>
  );
}
