import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from '@/components/Sidebar';
import "./globals.css";
import MobileSidebar from "@/components/MobileSidebar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KSA 택배 관리기",
  description: "한국과학영재학교(KSA)에 보관 중인 택배들의 상태를 관리하는 시스템입니다. 주문번호를 입력하여 택배의 위치를 확인하고, 도착 시 알림을 받을 수 있습니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <div className="flex h-screen overflow-hidden text-gray-900">
          <Sidebar session={session} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <MobileSidebar session={session}/>
            <main className="flex-1 h-full overflow-y-auto bg-white p-8 md:p-12">
              <SessionProvider>{children}</SessionProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
