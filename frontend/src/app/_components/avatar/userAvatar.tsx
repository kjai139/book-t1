
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function UserAvatar() {
    const session = useSession()
    console.log('session in userava', session)

    if (!session?.data?.user) {
        return <Avatar isDisabled name=""></Avatar>
    }

    const pathname = usePathname()

    const dropdownAction = (key:any) => {
        if (pathname === '/dashboard') {
            signOut({callbackUrl: '/login'})
        } else {
            signOut()
        }
    }



    return (
        <Dropdown>
            <DropdownTrigger>
                <Avatar as={"button"} src={session.data.user.image!} name={session.data.user.name!}>

                </Avatar>

            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions" disabledKeys={["profile"]} onAction={(key) => dropdownAction(key)}>
                <DropdownItem key={"profile"} textValue={`Signed in as ${session.data.user.email}`}>
                    <p>Signed in as {session.data.user.email}</p>
                </DropdownItem>
                <DropdownItem key={"bookmarks"}>
                    Your bookmarks
                </DropdownItem>
                <DropdownItem key={"signout"} color="danger">
                    Log Out
                </DropdownItem>

            </DropdownMenu>
       
        </Dropdown>
    )
}