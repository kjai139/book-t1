

export default interface User {
    name: string,
    _id: string,
    lcname?: string,
    role?: string,
    image?: string,
    email?:string,
    bio?: string,
    isVerified?: boolean
}

