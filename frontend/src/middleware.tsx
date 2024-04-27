import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { cookies } from "next/headers"
import { decrypt } from "./app/_lib/session"

const redis = new Redis({
    url: `${process.env.UPSTASH_REDIS_REST_URL}`,
    token: `${process.env.UPSTASH_REDIS_REST_TOKEN}`

})

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(7, '10 s')
})


export const config = {
    matcher: [
        {
            source: '/((?!_next/static|_next/image|favicon.ico|blocked).*)',
            missing: [
                {
                    type: 'header', key: 'next-router-prefetch'
                },
                {
                    type: 'header', key: 'purpose', value: 'prefetch'
                }
            ]
        }
    ]
}


export async function middleware(request: NextRequest) {

    const ip = request.ip ?? '127.0.0.1'
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip)
    console.log(`status:${success}, limit:${limit}, remaining:${remaining}`)
    const protectedRoutes = ['/dashboard']
    const loginRoutes = ['/login']
    const apiRoute = ['/api']
  
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isLoginRoute = loginRoutes.includes(path)
    const isApiRoute = apiRoute.includes(path)
    
    
    if (!success) {
        if (request.nextUrl.pathname.startsWith('/api')){
            return NextResponse.json({
                message: 'Too many requests'
            }, {
                status: 429
            })
        } else {
            return NextResponse.redirect(new URL('/blocked', request.url))
        }
        
    }

    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    
    

    

    //SET CSP NONCE
    console.log('generating nonce...')
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const cspHeader = `
        default-src 'self' https://www.google-analytics.com https://c.disquscdn.com https://disqus.com https://www.googletagmanager.com https://vitals.vercel-insights.com 'unsafe-inline' tagmanager.google.com;
        connect-src https://links.services.disqus.com 'self' https://vitals.vercel-insights.com localhost:3000 https://www.google-analytics.com;
        frame-src https://disqus.com https://www.google-analytics.com www.google-analytics.com;
        script-src 'self' ${process.env.NODE_ENV === "production" ? ''  : `'unsafe-eval'` } https://c.disquscdn.com https://52webtoons-com.disqus.com 'unsafe-inline' tagmanager.google.com https://www.googletagmanager.com https://va.vercel-scripts.com https://cdn.vercel-insights.com https://vitals.vercel-insights.com https://vercel.live https://www.google-analytics.com tagmanager.google.com;
        style-src 'self' 'unsafe-inline' https://c.disquscdn.com https://www.googletagmanager.com https://fonts.googleapis.com;
        img-src 'self' blob: data: https://wtdb128.s3.us-east-2.amazonaws.com https://c.disquscdn.com https://referrer.disqus.com https://www.google-analytics.com tagmanager.google.com www.google-analytics.com www.googletagmanager.com https://fonts.gstatic.com;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `


  // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim()
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )


    if (request.nextUrl.pathname !== request.nextUrl.pathname.toLowerCase()) {
    
       
        const response = NextResponse.redirect(new URL(origin + request.nextUrl.pathname.toLowerCase()), {
            headers: requestHeaders
        })
        response.headers.set(
            'Content-Security-Policy', contentSecurityPolicyHeaderValue
        )
        return response
            
        
    }
    //api protected
   
    //reroute out of protected
    if (isProtectedRoute && !session?._id) {
        
        console.log('TRIGGERE IN PROTECT ROUTE MW')
       
        const response = NextResponse.redirect(new URL('/login', request.url), {
            headers: requestHeaders
        })
        response.headers.set(
            'Content-Security-Policy', contentSecurityPolicyHeaderValue
        )
        return response
        
    }
   

    if (isLoginRoute && session?._id && !request.nextUrl.pathname.startsWith('/dashboard')) {
            console.log('TRIGGER IN LOGIN ROUTE MW')
            const response = NextResponse.redirect(new URL('/dashboard', request.url), {
                headers: requestHeaders
            })
            response.headers.set(
                'Content-Security-Policy', contentSecurityPolicyHeaderValue
            )
            return response
    }
    
    console.log('TRIGGER IN NEITHER LOGIN OR DASH')
    const response = NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    })
    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )
    return response

}