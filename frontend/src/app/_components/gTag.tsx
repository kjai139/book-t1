import Script from 'next/script'
import { headers } from 'next/headers'

export default function GoogleAnalytics ({nonce}:{nonce:string}) {
    console.log('nonce:', nonce)
    return (
        <>
        <Script strategy='afterInteractive' src="https://www.googletagmanager.com/gtag/js?id=G-J41ZCWS7F1" nonce={nonce}>
        
        <Script id='google-analytics' strategy='afterInteractive' nonce={nonce}>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-J41ZCWS7F1');
            `}
        </Script>
        </Script>
        </>
    )
}