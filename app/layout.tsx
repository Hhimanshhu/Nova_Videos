import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProvidersWrapper from "./components/ProvidersWrapper";
import { Toaster } from "react-hot-toast"; // ✅ Add this

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Uploader App",
  description: "Upload & Manage Your Videos Easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ProvidersWrapper>
          {children}
          <Toaster position="top-center" reverseOrder={false} /> 
        </ProvidersWrapper>
      </body>
    </html>
  );
}
