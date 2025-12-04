import type { Metadata } from "next";
import { Unbounded, Work_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

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
  openGraph: {
    title: "Goodreads Wrapped 2025",
    description: "Your reading year, wrapped.",
    images: [
      {
        url: "/Goodreads-Image.png",
        width: 1200,
        height: 630,
        alt: "Goodreads Wrapped 2025",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodreads Wrapped 2025",
    description: "Your reading year, wrapped.",
    images: ["/Goodreads-Image.png"],
  },
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
        <Analytics />
      </body>
    </html>
  );
}
