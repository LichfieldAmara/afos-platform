import type { Metadata } from "next";
import "./globals.css";
import "./simple-request.css";

export const metadata: Metadata = {
  title: "AFOS | African Freight Operating System",
  description:
    "Request trucks and trailers for transport in Sierra Leone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
