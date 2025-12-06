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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Goodreads Wrapped 2025 | Your reading year, wrapped.",
    template: "%s | Goodreads Wrapped 2025"
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  description: "Create your personalized Goodreads Wrapped 2025! Discover your reading stats, top books, favorite genres, and more. Share your results with friends.",
  keywords: ["goodreads", "spotify wrapped", "reading stats", "year in review", "book tracker", "reading challenge", "books", "reading wrapped", "goodreads wrapped 2025"],
  authors: [{ name: "Goodreads Wrapped" }],
  creator: "Goodreads Wrapped",
  publisher: "Goodreads Wrapped",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Goodreads Wrapped 2025 | Your reading year, wrapped.",
    description: "Create your personalized Goodreads Wrapped 2025! Discover your reading stats, top books, favorite genres, and more.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "Goodreads Wrapped 2025",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Goodreads-Image.png",
        width: 1200,
        height: 630,
        alt: "Goodreads Wrapped 2025 | Your reading year, wrapped.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodreads Wrapped 2025 | Your reading year, wrapped.",
    description: "Create your personalized Goodreads Wrapped 2025! Discover your reading stats, top books, and favorite genres.",
    images: ["/Goodreads-Image.png"],
    creator: "@goodreadswrapped", // Add if you have a Twitter handle
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
