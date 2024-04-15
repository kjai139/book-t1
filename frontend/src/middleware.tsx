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
    matcher: ['/((?!_next/static|_next/image|favicon.ico|blocked).*)']
}


export async function middleware(request: NextRequest) {

    const ip = request.ip ?? '127.0.0.1'
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip)
    console.log(`status:${success}, limit:${limit}, remaining:${remaining}`)
    
    if (!success) {
        return NextResponse.redirect(new URL('/blocked', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/genres') || request.nextUrl.pathname.startsWith('/read')) {
        const { pathname, origin} = request.nextUrl
        if (pathname === pathname.toLowerCase() ) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL(origin + pathname.toLowerCase()))
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
                  
                        return NextResponse.redirect(new URL('/dashboard', request.url))
                    
                } else {
                    if (request.nextUrl.pathname.startsWith('/dashboard')) {
                        return NextResponse.redirect(new URL('/login', request.url))
                    }
                }

            } catch (err) {
                console.log(err)
            }
        } else {
            //jwt doesn't exist
            if (request.nextUrl.pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    } else {
        return NextResponse.next()
    }

    
}