import { NextResponse } from "next/server"


export const config = {
    matcher: ['/dashboard/:path*']
}


export default function middleware(req) {
    /* const jwtToken = req.cookies['jwt']
    if (!jwtToken) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOME_URL}/login`)
    }
 */

}