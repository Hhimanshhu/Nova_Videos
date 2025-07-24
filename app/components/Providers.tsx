import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";

if (!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
  throw new Error("Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in env");
}
const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider
                urlEndpoint={urlEndPoint}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}