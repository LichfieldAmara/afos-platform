import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFOS | African Freight Operating System",
  description:
    "A container transport capacity coordination platform for Sierra Leone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
