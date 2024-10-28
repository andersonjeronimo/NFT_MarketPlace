import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "NFC Marketplace OpenSea® like",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <main>
          <section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
            <Header />
          </section>

          {children}

        </main>
        <Footer />
      </body>
      {/* <body className="text-gray-500">{children}</body> */}
    </html>
  );
}
