import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getUserId } from "./app/_lib/signInCb"
import type { NextAuthConfig } from "next-auth"



export const config = {
    providers: [Google({
        authorization: {
            params: {
                prompt: 'select_account'
            }
        }
    })],
    callbacks: {
        async signIn({user, account}:any) {
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
            } else {
                return false
            }
        
        },
        jwt({ token, user}:any) {
            if (user) {
                token.id = user._id
            }
            return token
        },
        session({session, token}:any) {
            session.user.id = token.id
            return session
        },
    }
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)