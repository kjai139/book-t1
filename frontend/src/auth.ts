import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import User from "./app/_models/users"
import { dbConnect } from "./app/_utils/db"

export const config = {
    providers: [Google({
        authorization: {
            params: {
                prompt: 'select_account'
            }
        }
    })],
    callbacks: {
        jwt({ token, user}) {
            if (user) {
                token.id = user.id
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