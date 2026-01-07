import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/footer";
import VisitorTracker from "@/components/analytics/VisitorTracker";
// Pastikan import path ini sesuai dengan lokasi file wrapper yang kamu buat
import ChatWidgetWrapper  from "@/components/chat/chat-widget-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-1412 | Dynamic Portfolio",
  description: "Personal portfolio and playground built with Next.js 16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <VisitorTracker />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1">{children}</main>
          
          {/* 👇 UPDATE DISINI: Gunakan Wrapper agar chatbot hilang di Dashboard */}
          <ChatWidgetWrapper />
          
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}