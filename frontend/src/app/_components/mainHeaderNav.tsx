'use client'

import { useState } from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Divider } from "@nextui-org/react";
import BookmarkBtn from "./button/bookmark";
import { useSession } from "next-auth/react";
import homeIcon from '../apple-icon.png'
import NextImage from "next/image";
import { serverLogUserOut } from "../actions";
import { useAuth } from "../_contexts/authContext";
import { ThemeSwitcher } from "./themeSwitcher";
import { FaSearch } from "react-icons/fa";
import SlideSearchBar from "./button/slideSearch";
import UserAvatar from "./avatar/userAvatar";
import { FaBookmark } from "react-icons/fa";

interface MenuItems {
  name: string,
  url?: string,
  type: string,
  func?: () => Promise<void>
}

export default function MainHeaderNav() {

  const publicMenu = [
    {
      name: 'Home',
      type: 'link',
      url: '/'

    },
    {
      name: 'View Webtoons',
      type: 'link',
      url: '/read'
    }
  ]

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItems[]>(publicMenu)
  const [errorMsg, setErrorMsg] = useState('')
  const { user, setUser } = useAuth()
  const session = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)




  /* const logUserOut = async () => {
    const isLogOutSuccessful = await serverLogUserOut()
    if (isLogOutSuccessful) {
      setMenuItems(publicMenu)
      setUser(null)
    } else {
      setErrorMsg('Encountered an error trying to logout.')
    }
  } */




  return (
    <div className="flex flex-col items-center">

      <Navbar disableAnimation={true} isBordered position={'static'} onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} maxWidth="lg">
        <NavbarContent justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
          <NavbarBrand className="ng">

            <Button variant="flat" as={Link} href="/" isIconOnly>
              <NextImage src={homeIcon} alt="Home Icon Image" priority></NextImage>
            </Button>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>

          </NavbarBrand>
        </NavbarContent>



        <NavbarContent justify="end">
          <NavbarItem className="ng">
            <Button isDisabled={session.status === 'loading'} isIconOnly aria-label="Toggle Searchbar" onPress={() => setIsSearchOpen(prev => !prev)}>
              <FaSearch></FaSearch>
            </Button>
  
          </NavbarItem>
          <NavbarItem>
            {
              session.status === 'authenticated' ?
                <Button aria-label="Bookmark page icon" as={Link} href="/bookmarks" isIconOnly className="shudder data-[hover=true]:opacity-100">
                  <FaBookmark></FaBookmark>
                </Button>
                : null
            }
            {
              session.status === 'loading' ?
                <Button aria-label="Loading Bookmark page icon" isIconOnly className="shudder data-[hover=true]:opacity-100" isDisabled>
                  <FaBookmark></FaBookmark>
                </Button>
                : null
            }
            {
              session.status === 'unauthenticated' ?
                <BookmarkBtn></BookmarkBtn> : null
            }

          </NavbarItem>
          <NavbarItem className="hidden sm:block">
            <ThemeSwitcher></ThemeSwitcher>
          </NavbarItem>
          <NavbarItem>
            <UserAvatar session={session}></UserAvatar>
          </NavbarItem>

        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => {


            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                {item.type === 'link' ? <Link
                  className="w-full"
                  color={
                    index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                  }
                  href={item.url} onClick={() => setIsMenuOpen(false)}
                  size="lg"
                >
                  {item.name}
                </Link> :
                  <>
                    <Divider className="my-4" />
                    <Button className="w-full" size="md" color={`${item.name === 'Sign Out' ? 'danger' : 'primary'}`} onPress={item?.func}>
                      {item.name}
                    </Button>
                    {
                      errorMsg &&
                      <span className="text-danger text-sm">{errorMsg}</span>
                    }

                  </>

                }
              </NavbarMenuItem>
            )
          })}
          <NavbarMenuItem>
            <div className="flex gap-2">
              <span>Light Switch</span>
              <ThemeSwitcher></ThemeSwitcher>
            </div>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <SlideSearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen}></SlideSearchBar>

    </div>
  );
}