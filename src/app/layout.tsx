import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { GuestProvider } from "@/contexts/GuestContext"; // <-- uncomment
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gzone",
  description: "The Quiz Competition Platform",
  icons: {
    icon: "/logo.png",
  },
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
        {/* <GuestProvider> {/* <-- now wrap children */}
          {children}
        {/* </GuestProvider> */}
      </body>
    </html>
  );
}