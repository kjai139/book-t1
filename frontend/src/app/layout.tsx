import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './_styles/globals.css'
import { Providers } from "./provider";
import { AuthProvider } from "./_contexts/authContext";
import MainHeaderNav from "./_components/mainHeaderNav";
import apiUrl from "./_utils/apiEndpoint";
import MainFooter from "./_components/footer/mainFooter";

const inter = Inter({ subsets: ["latin"] });


export async function generateMetadata () {
  const response = await fetch(`${apiUrl}/api/metadata/get`, {
    method: 'GET',
    next: {
      revalidate: 1
    }
  })
  const data = await response.json()
  return {
    title: data.siteData.title,
    description: data.siteData.shortDesc,
    openGraph: {
      images: data.siteData.ogImg
    }
  }
}








export default function RootLayout({
  children, params
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
        <MainFooter></MainFooter>
        </Providers>
        </AuthProvider>
        </body>
    </html>
  );
}
