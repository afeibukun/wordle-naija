import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {GoogleAnalytics} from '@next/third-parties/google';
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Wordle Naija",
    description: "A simple wordle game, with naija language",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-950`}
        >
        <body className="min-h-full flex flex-col w-full overflow-x-hidden">{children}</body>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID &&
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}/>
        }
        </html>
    );
}
