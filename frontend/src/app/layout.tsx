
import { Inter } from "next/font/google";
import './_styles/globals.css'
import { Providers } from "./provider";
import MainHeaderNav from "./_components/mainHeaderNav";
import MainFooter from "./_components/footer/mainFooter";
import GoogleAnalytics from "./_components/gTag";
import { headers } from "next/headers";
import SiteData from '@/app/_models/siteData'
import { dbConnect } from "./_utils/db";
import { Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";


const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata () {
  try {
    await dbConnect()
    const siteData = await SiteData.findOne()
   
    return {
      title: siteData.title,
      description: siteData.shortDesc,
      openGraph: {
        images: siteData.ogImg,
        title: siteData.title,
        url: siteData.url,
        description: siteData.description,
        siteName: siteData.title,
        type: 'website',
        locale: 'en_US',
      }
    }

  } catch (err:any) {
      console.error(err)
  }
  
}

export const viewport:Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4098D7'},
    { media: '(prefers-color-scheme: dark)', color: 'black'} 
  ],
}








export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
  params: any
}>) {
  const nonce:any = headers().get('x-nonce')


  return (
      <html lang="en" className="dTheme" suppressHydrationWarning>
        <body className={`${inter.className} bg-background-100`}>
        <Providers>
          <NextTopLoader color="#4098D7" showSpinner={false}></NextTopLoader>
          
          <MainHeaderNav></MainHeaderNav>
          {children}
          <MainFooter></MainFooter>
          <SpeedInsights></SpeedInsights>
        
        </Providers>
        
        </body>
        <GoogleAnalytics nonce={nonce}></GoogleAnalytics>
      </html>
   
  );
}
