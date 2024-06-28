import { FcGoogle } from "react-icons/fc"
import { Button } from "@nextui-org/react"
import { signIn } from "next-auth/react"


export function GoogleBtn() {
    return (
        <Button onPress={() => signIn('google')} startContent={
            <FcGoogle></FcGoogle>
        }>Log in with Google</Button>
    )
}