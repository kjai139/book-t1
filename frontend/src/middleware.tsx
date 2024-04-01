import { NextRequest, NextResponse } from "next/server"
import apiUrl from "./app/_utils/apiEndpoint"


export const config = {
    matcher: ['/dashboard/:path*', '/login/:path*']
}


export async function middleware(request: NextRequest) {

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