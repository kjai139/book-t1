import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './_styles/globals.css'
import { Providers } from "./provider";
import { AuthProvider } from "./_contexts/authContext";
import MainHeaderNav from "./_components/mainHeaderNav";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Goated M",
  description: "Archive of fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="blue-dark">
      <body className={inter.className}>
        <AuthProvider>
        <Providers>
        <MainHeaderNav></MainHeaderNav>
        {children}
        </Providers>
        </AuthProvider>
        </body>
    </html>
  );
}
