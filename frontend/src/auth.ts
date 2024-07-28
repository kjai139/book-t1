import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getUserId } from "./app/_lib/signInCb"




export const config = {
    providers: [Google({
        authorization: {
            params: {
                prompt: 'select_account'
            }
        }
    })],
    callbacks: {
        async signIn({user, account, profile}) {
            if (account?.provider === 'google') {
                try {
                    const userId = await getUserId(user.email)
                    if (userId) {
                        user._id = userId
                        return true
                    } else {
                        return false
                    }
                } catch (err) {
                    return false
                }
            }
        
        },
        jwt({ token, user}) {
            if (user) {
                token.id = user._id
            }
            return token
        },
        session({session, token}) {
            session.user.id = token.id
            return session
        },
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)