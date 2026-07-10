import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
  title: "SortMail | Autonomous AI Email Triage",
  description: "An intelligent, privacy-first email routing engine built for focus. Configure autonomous rules to blast context-aware AI replies.",
  keywords: ["AI email", "email triage", "inbox zero", "autonomous email", "LLM email client", "Gmail AI", "automated replies", "SortMail", "AI productivity"],
  authors: [{ name: "SortMail Team" }],
  creator: "SortMail",
  publisher: "SortMail",
  metadataBase: new URL("https://sortmail.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SortMail | Autonomous AI Email Triage",
    description: "An intelligent, privacy-first email routing engine built for focus.",
    url: "https://sortmail.vercel.app",
    siteName: "SortMail",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SortMail AI Triage Engine"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SortMail | Autonomous AI Email Triage",
    description: "An intelligent, privacy-first email routing engine built for focus.",
    creator: "@sortmail",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: "your-google-site-verification-code",
  },
  category: "productivity",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SortMail",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-right" toastOptions={{ className: 'font-mono text-sm uppercase tracking-widest rounded-sm border border-neutral-200 shadow-sm' }} />
      </body>
    </html>
  );
}
