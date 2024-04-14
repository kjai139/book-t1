import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './_styles/globals.css'
import { Providers } from "./provider";
import { AuthProvider } from "./_contexts/authContext";
import MainHeaderNav from "./_components/mainHeaderNav";
import apiUrl from "./_utils/apiEndpoint";
import MainFooter from "./_components/footer/mainFooter";
import GoogleAnalytics from "./_components/gTag";

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
      images: data.siteData.ogImg,
      title: data.siteData.title,
      url: data.siteData.url,
      description: data.siteData.description,
      siteName: data.siteData.title,
      type: 'website',
      locale: 'en_US',
    }
  }
}








export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
      <html lang="en" className="dTheme" suppressHydrationWarning>
        <body className={`${inter.className} bg-background-100`}>
        <Providers>
        
        <MainHeaderNav></MainHeaderNav>
        {children}
        <MainFooter></MainFooter>
        
        </Providers>
        
        </body>
        <GoogleAnalytics></GoogleAnalytics>
      </html>
   
  );
}
