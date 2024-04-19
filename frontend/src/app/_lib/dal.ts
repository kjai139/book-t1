import 'server-only'


import { cookies } from 'next/headers'
import { decrypt } from './session'
import { cache } from 'react'


export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    if (!session?._id) {
        return null
    } else {
        return { _id: session._id, name:session.name}
    }

})