import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { cookies } from "next/headers"
import { decrypt } from "./app/_lib/session"
import { auth } from "./auth"
import { randomHash } from "./app/_utils/version"

const redis = new Redis({
    url: `${process.env.UPSTASH_REDIS_REST_URL}`,
    token: `${process.env.UPSTASH_REDIS_REST_TOKEN}`

})

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(8, '10 s')
})


export const config = {
    matcher: [
        {
            source: '/((?!_next/static|_next/image|favicon.ico|blocked|api/auth).*)',
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

    /* const ip = request.ip ?? '127.0.0.1'
    const { success, limit, remaining } = await ratelimit.limit(ip) */
    
    const protectedRoutes = ['/dashboard']
    const loginRoutes = ['/login']
    
  
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isLoginRoute = loginRoutes.includes(path)

    if (request.nextUrl.pathname.startsWith('/api/cron/') || request.nextUrl.pathname.startsWith('/serverError')) {
        return NextResponse.next()
    }

    if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/auth/') && !request.nextUrl.pathname.startsWith('/api/cron') && !request.nextUrl.pathname.startsWith('/serverError') && !request.nextUrl.pathname.startsWith('/api/auth/') ){
        const ip = request.ip ?? '127.0.0.1'
        const { success, limit, remaining } = await ratelimit.limit(ip)
        console.log(`status:${success}, limit:${limit}, remaining:${remaining}`)
        
        if (!success) {
            return NextResponse.json({
                message: 'Too many requests'
            }, {
                status: 429
            })
        } else {
            return NextResponse.next()
        }
        
    }
    
    if (request.nextUrl.pathname.startsWith('/read/')) {
        const wtName = request.nextUrl.pathname.split('/read/')[1]

        if (wtName.length > 0 && !wtName.includes(randomHash)) {
            return NextResponse.redirect(new URL('/not-found', request.nextUrl))
        } else {
            return NextResponse.next()
        }
    }
    
    /* if (!success) {
        if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/auth/')){
            return NextResponse.json({
                message: 'Too many requests'
            }, {
                status: 429
            })
        } else if (!request.nextUrl.pathname.startsWith('/api/auth/')) {
            return NextResponse.redirect(new URL('/blocked', request.url))
        }
        
    } */

    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)
    const oauthSess = await auth()

    if (!oauthSess?.user && !session?._id) {
        console.log('User is not logged in')
    } else {
        if (oauthSess?.user) {
            console.log('User is logged in via oauth', oauthSess)
        } else if (session?._id) {
            console.log('User is logged in via user/pw', session)
        }
    }


    if (!request.nextUrl.pathname.startsWith('/api/') && request.nextUrl.pathname !== request.nextUrl.pathname.toLowerCase()) {
    
       
        const response = NextResponse.redirect(new URL(request.nextUrl.origin + request.nextUrl.pathname.toLowerCase()))
        
        return response
            
        
    }
    //api protected
   
    //reroute out of protected
    if (isProtectedRoute && (!session?._id && !oauthSess?.user)) {
        
        console.log('TRIGGERE IN PROTECT ROUTE MW')
       
        const response = NextResponse.redirect(new URL('/login', request.url))
      
        return response
        
    }
   

    if (isLoginRoute && (session?._id || oauthSess?.user) && !request.nextUrl.pathname.startsWith('/dashboard')) {
            console.log('TRIGGER IN LOGIN ROUTE MW')
            const response = NextResponse.redirect(new URL('/dashboard', request.url))
           
            return response
    }
    
    console.log('TRIGGER IN NEITHER LOGIN OR DASH')
    const response = NextResponse.next()
    
    return response

}