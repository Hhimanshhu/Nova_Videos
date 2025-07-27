'use client';
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
import Navbar from "./Navbar";

const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndpoint={urlEndPoint}>
        <Navbar />
        <main>{children}</main>
      </ImageKitProvider>
    </SessionProvider>
  );
}