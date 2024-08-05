import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
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
                /* try {
                    const userId = await getUserId(user.email)
                    if (userId) {
                        user._id = userId
                        return true
                    } else {
                        return false
                    }
                } catch (err) {
                    return false
                } */
               return true
            } else {
                return false
            }
        
        },
        async jwt({ token, user, trigger, session}:any) {
            console.log('JWT CALLBACK INVOKED', trigger)
            /* if (user) {
                token.id = user._id
            }
            return token */
            if (trigger === "update" && session?.user?.id) {
                console.log(session, '****FROM JWT CB*****')
                token.id = session.user.id
            }
            return token
        },
        async session({session, token}:any) {
            console.log('SESSION CB INVOKED')
            session.user.id = token.id
            return session
        },
    }
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)