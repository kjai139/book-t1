
import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function UserAvatar() {
    const session = useSession()
    console.log('session in userava', session)

    if (!session?.data?.user) {
        return <Avatar isDisabled name=""></Avatar>
    }

    return (
        <Avatar src={session.data.user.image!} name={session.data.user.name!}>

        </Avatar>
    )
}