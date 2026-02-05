import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "RSP - Data Entry",
  description: "Election voter data entry system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Text:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <MantineProvider
          theme={{
            fontFamily: "'Stack Sans Text', sans-serif",
            headings: { fontFamily: "'Stack Sans Text', sans-serif" },
          }}
        >
          <Notifications position="top-right" />
          <QueryProvider>{children}</QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
