
import { useAuth } from "@/app/_contexts/authContext";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { serverLogUserOut } from "@/app/actions";

export default function UserAvatar({session}:any) {
    
    const pathname = usePathname()
    console.log('session in userava', session)
    const { user, setUser } = useAuth()
    console.log(user)

    if (session.status === 'unauthenticated' && !user) {
        return (
            <Dropdown className="p-2">
                <DropdownTrigger>
                    <Avatar as={"button"} name=""></Avatar>
                </DropdownTrigger>
                <DropdownMenu aria-label="Link Actions" disabledKeys={[`${pathname}`]}>
                    <DropdownItem href="/login" key="/login">
                        Log in
                    </DropdownItem>
                    <DropdownItem href="/bookmarks" key='/bookmarks'>
                        Your bookmarks
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }


    const dropdownAction = (key:any) => {
        if (pathname === '/dashboard' && key === 'signout') {
            signOut({callbackUrl: '/login'})
        } else if (key === 'signout') {
            signOut()
        }
    }

    const logUserOut = async () => {
        const isLogOutSuccessful = await serverLogUserOut()
        if (isLogOutSuccessful) {
          setUser(null)
        } else {
          console.error('Encountered an error trying to logout.')
        }
      }

    const dropdownActionUser = (key:any) => {
        if (key === 'signout') {
           logUserOut()
        }
    }



    return (
        <>
        {session.status === 'loading' ?
            <Avatar name="" isDisabled></Avatar> : null
        }
        {session.status === 'authenticated' && session.data.user ? <Dropdown>
            <DropdownTrigger>
                <Avatar as={"button"} src={session.data.user.image!} name={session.data.user.name!}>

                </Avatar>

            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions" disabledKeys={["profile", `${pathname === '/bookmarks' ? 'bookmarks' : null}`]} onAction={(key) => dropdownAction(key)} className="max-w-[280px] sm:max-w-max">
                <DropdownItem key={"profile"} textValue={`Signed in as ${session.data.user.email}`}>
                    <p>Signed in as {session.data.user.email}</p>
                </DropdownItem>
                <DropdownItem key={"bookmarks"} href="/bookmarks">
                    Your bookmarks
                </DropdownItem>
                <DropdownItem key={"signout"} color="danger">
                    Log Out
                </DropdownItem>

            </DropdownMenu>
       
        </Dropdown> : null}
        {
            user && session.status === 'unauthenticated' ?
            <Dropdown>
            <DropdownTrigger>
                <Avatar as={"button"} name="">

                </Avatar>

            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions" disabledKeys={["profile", `${pathname === '/bookmarks' ? 'bookmarks' : null}`]} onAction={(key) => dropdownActionUser(key)}>
                <DropdownItem key={"profile"} textValue={`Signed in as ${user.name}`}>
                    <p>Signed in as {user.name}</p>
                </DropdownItem>
                <DropdownItem key={"bookmarks"} href="/bookmarks">
                    Your bookmarks
                </DropdownItem>
                <DropdownItem key={"signout"} color="danger">
                    Log Out
                </DropdownItem>

            </DropdownMenu>
       
            </Dropdown> : null

        }
        
        </>
    )
}