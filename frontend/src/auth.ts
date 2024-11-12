import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { dbConnect } from "./app/_utils/db";
import { generateRandomName } from "./app/_utils/generateName";

declare module "next-auth" {
    interface Session {
        user: {
            currencyAmt: number
        } & DefaultSession['user'];

        expires: string;
        error?: string,
        errorMessage?: string

    }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        authorization: {
            params: {
                prompt: 'select_account'
            }
        }
    })],
    cookies: {
        sessionToken: {
            name: '52wt-session-token'
        }
    },
    callbacks: {
        async jwt({ token, account, profile, user }) {
            try {
                const isEdge = process.env.NEXT_RUNTIME === 'edge'
                if (isEdge) {
                    console.log('[JWT CALLBACK] RUNTIME = ', process.env.NEXT_RUNTIME, 'Returning Token...')
                    return token
                } else {
                    console.log('[JWT CALLBACK] RUNTIME = ', process.env.NEXT_RUNTIME)
                    const users = (await import("./app/_models/users")).default
                    await dbConnect()
                    if (user) {
                        if (!profile || !profile.email) {
                            console.log('token', token)
                            console.log('account', account)
                            console.log('profile', profile)
                            console.log('user', user)
                            throw new Error('User does not have an email in profile')
                        }
                        const existingUser = await users.findOne({
                            email: profile.email
                        })

                        if (!existingUser) {
                            console.log('[JWT CALLBACK] User does not exist')
                            let isUnique
                            let userName
                            let lcUsername
                            const dateStr = Date.now()
                            while (!isUnique) {
                                userName = generateRandomName()
                                lcUsername = userName.toLowerCase()
                                let isNameTaken = await users.findOne({
                                    lcname: lcUsername
                                })
                                if (!isNameTaken) {
                                    isUnique = true
                                }
                            }
                            const newUser = await users.create({
                                email: profile.email,
                                lcname: lcUsername,
                                name: userName,
                                password: `temp${dateStr}`
                            })

                            console.log('[JWT CALLBACK]NEW USER CREATED:', newUser)

                            token.id = newUser._id
                        } else {
                            console.log('User already exists : ', existingUser)
                            token.id = existingUser._id
                        }
                    }

                    return token
                }
                

            } catch (err) {
                console.error(err)
                token.dbError = true
                return token
            }
        },
        async session({ session, token }: any) {
            console.log('SESSION CB INVOKED')
            if (token.id) {
                session.user.id = token.id.toString()

            }
            if (token?.dbError) {
                return {
                    ...session,
                    error: true,
                    errorMessage: 'Database connection issue, please try relogging / try again later.'
                }
            }
            return session
        },
    }
})

