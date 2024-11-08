import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppStarter from "@/components/layouts/AppStarter";
import MainLayout from "@/components/layouts/MainLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nano Expense",
  description: "Daily income, outcome and reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainLayout>
          <AppStarter>
            {children}
          </AppStarter>
        </MainLayout>
      </body>
    </html>
  );
}
