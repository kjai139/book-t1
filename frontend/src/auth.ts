import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import users from "./app/_models/users"
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
        /* async signIn({user, account, profile}) {
            try {
                await dbConnect()
                console.log('USER IN signin callback', user)
                const theUser = await users.findOne({
                    email: user.email
                })
                console.log('theUSER in cb', theUser)
               return true
            } catch (err) {
                return false
            }
        }, */
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