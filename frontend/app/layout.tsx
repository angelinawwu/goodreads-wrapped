import type { Metadata } from "next";
import { Unbounded, Work_Sans } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const work_sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",  
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goodreads Wrapped 2025",
  description: "Your reading year, wrapped.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${work_sans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
