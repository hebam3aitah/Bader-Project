"use client";    

import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import SessionWrapper from "@/app/components/SessionWrapper";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import VolunteerChatFloatingWrapper from "./components/VolunteerChatFloatingWrapper"; // ✅
import 'leaflet/dist/leaflet.css';

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans-arabic",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldHideNavbar = () =>
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/dashboard");

  const shouldHideFooter = () =>
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/dashboard");

  return (
    <html lang="ar" className={interFont.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <SessionWrapper>
          <Toaster position="top-right" reverseOrder={false} />
          {!shouldHideNavbar() && <Navbar />}
          <main>{children}</main>
          <VolunteerChatFloatingWrapper />

          {!shouldHideFooter() && <Footer />}
            <VolunteerChatFloatingWrapper />

        </SessionWrapper>
      </body>
    </html>
  );
}
