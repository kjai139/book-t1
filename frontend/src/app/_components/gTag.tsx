import Script from 'next/script'


export default function GoogleAnalytics () {
    return (
        <>
        <Script strategy='lazyOnload' src="https://www.googletagmanager.com/gtag/js?id=G-J41ZCWS7F1">
        
        <Script id='google-analytics' strategy='lazyOnload'>
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