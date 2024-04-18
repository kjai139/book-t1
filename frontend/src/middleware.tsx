import { NextRequest, NextResponse } from "next/server"
import apiUrl from "./app/_utils/apiEndpoint"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: `${process.env.UPSTASH_REDIS_REST_URL}`,
    token: `${process.env.UPSTASH_REDIS_REST_TOKEN}`

})

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '10 s')
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
    
    if (!success) {
        return NextResponse.redirect(new URL('/blocked', request.url))
    }


    //SET CSP NONCE
    /* const nonce = Buffer.from(crypto.randomUUID()).toString('base64') */
    const cspHeader = `
        default-src 'self' localhost:4000 www.google-analytics.com;
        script-src 'self' ${process.env.NODE_ENV === "production" ? ''  : `'unsafe-eval'` } https://www.googletagmanager.com/gtag/js 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://wtdb128.s3.us-east-2.amazonaws.com;
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
    /* requestHeaders.set('x-nonce', nonce) */
    
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )
    

    if (request.nextUrl.pathname.startsWith('/genres') || request.nextUrl.pathname.startsWith('/read')) {
        const { pathname, origin} = request.nextUrl
        if (pathname === pathname.toLowerCase() ) {
            return NextResponse.next({
                request: {
                    headers: requestHeaders
                },
                headers: {
                    'Content-Security-Policy': contentSecurityPolicyHeaderValue
                }
            })
        } else {
            const response1 = NextResponse.redirect(new URL(origin + pathname.toLowerCase()), {
                headers: requestHeaders
            })
            response1.headers.set(
                'Content-Security-Policy', contentSecurityPolicyHeaderValue
            )
            return response1
            
        }
    } else if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/dashboard')) {
        //if dashboard or login route
        const jwt = request.cookies.get('jwt')
        if (jwt) {
            const cookieHeader = `${jwt.name}=${jwt.value}; HttpOnly`
            try {
                const response = await fetch (`${apiUrl}/api/auth/check`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Cookie: cookieHeader
                    }
                })
                //server to server set cookie headers

                if (response.ok) {
                    console.log('RESPONSE OK MIDDLEWARE')
                    if (request.nextUrl.pathname.startsWith('/login')) {
                        return NextResponse.redirect(new URL('/dashboard', request.url), {
                            headers: requestHeaders
                        })
                    } else {
                        return NextResponse.next({
                            request: {
                                headers: requestHeaders
                            },
                            headers: {
                                'Content-Security-Policy': contentSecurityPolicyHeaderValue
                            }
                        })
                    }
                    
                } else {
                    if (request.nextUrl.pathname.startsWith('/dashboard')) {
                        return NextResponse.redirect(new URL('/login', request.url), {
                            headers:requestHeaders
                        })
                    }
                }

            } catch (err) {
                console.log(err)
            }
        } else {
            //jwt doesn't exist
            if (request.nextUrl.pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/login', request.url), {
                    headers: requestHeaders
                })
            }
        }
    } else if (!request.nextUrl.pathname.startsWith('/api')) {
        console.log('NOT API ROUTE triggered')
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

    
}