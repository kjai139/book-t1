import { NextRequest, NextResponse } from "next/server"
import apiUrl from "./app/_utils/apiEndpoint"


export const config = {
    matcher: ['/dashboard/:path*', '/login/:path*', '/genres/:path*']
}


export async function middleware(request: NextRequest) {

    if (request.nextUrl.pathname.startsWith('/genres')) {
        const { pathname, origin} = request.nextUrl
        if (pathname === pathname.toLowerCase() ) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL(origin + pathname.toLowerCase()))
        }
    } else {
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
                        return NextResponse.redirect(new URL('/dashboard', request.url))
                    }
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
    }

    
    



   /*  if (request.nextUrl.pathname.startsWith('/dashboard')) {
        try {
            console.log('request', request)
            const response = await fetch(`http:/localhost:3000/api/checkAuth`, {
                method: 'POST',
                cache: 'no-cache',
                credentials: 'include',
                
    
            })
    
            if (!response.ok) {
                console.log(response)
                const json = await response.json()
                console.log('middleware response not ok', json)
                return NextResponse.redirect(new URL('/login', request.url))
            }     
    
        } catch (err) {
            console.log(err)
        }
    }

    if (request.nextUrl.pathname.startsWith('/login')) {
        try {
            const response = await fetch(`/api/checkAuth`, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                
    
            })

            if (response.ok) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            } else {
                NextResponse.next()
            }
        } catch (err) {
            console.log(err)
        }
    }

    
 */
}