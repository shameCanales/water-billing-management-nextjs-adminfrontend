import type { Metadata } from "next";
import "./globals.css";
import ReduxToolkitProvider from "@/lib/providers/ReduxToolkitProvider";
import TanstackProvider from "@/lib/providers/TanstackProvider";
import AuthProvider from "@/components/Providers/AuthProvider";
import { outfit } from "@/lib/fonts";
import { ToastProvider } from "@/components/Providers/ToastProvider";

export const metadata: Metadata = {
  title: "SF Water Billing Management System",
  description: "Demo Admin Dashboard for SF Water Billing Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxToolkitProvider>
        <TanstackProvider>
          <body className={`${outfit.className} antialiased`}>
            <AuthProvider>{children}</AuthProvider>
            <ToastProvider />
          </body>
        </TanstackProvider>
      </ReduxToolkitProvider>
    </html>
  );
}
