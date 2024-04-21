import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)


export async function encrypt(payload:any) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encodedKey)

}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256']
        })
        console.log('decrypt success, payload:', payload)
        return payload

    } catch (err) {
        console.log('Failed to verify session')
    }
}

export async function createSession(userObj:any) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    const session = await encrypt(userObj)

    cookies().set('session', session, {
        httpOnly:true,
        secure:true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'

    })
    console.log('SESSION CREATED')
}

export async function refreshSession() {
    const session = cookies().get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        console.log('session: user is not logged in')
        return null
    }
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    /* const newSession = await encrypt({payload}) */
    
   

    cookies().set('session', session, {
        httpOnly:true,
        secure:true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'

    })
    return true
    
}


export async function deleteSession () {
    cookies().delete('session')
}