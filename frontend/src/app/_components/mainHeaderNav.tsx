'use client'

import { useEffect, useState } from "react"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Divider, Input} from "@nextui-org/react";
import { useAuth } from "../_contexts/authContext";
import NavSearch from "./button/search";
import BookmarkBtn from "./button/bookmark";
import PbNavSearch from "./button/pbSearch";

interface MenuItems {
  name: string,
  url?: string,
  type: string,
  func?: () => Promise<void>
}

export default function MainHeaderNav () {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItems[]>([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isBookmarkOpen, setIsBookmarkOpen] = useState(false)

    const { user, authCheck, logUserOut } = useAuth()

    const loggedInMenu = [
      {
        name: 'Dashboard',
        type: 'link',
        url: '/dashboard'
      },
      {
        name: 'Sign Out',
        type: 'button',
        func: logUserOut

      }
    ]

    const publicMenu = [
      {
        name: 'Create Account',
        type: 'link',
        url: '/register'
      },
      {
        name: 'Log In',
        type: 'link',
        url: '/login'
      }
    ]

    

      useEffect(() => {
        authCheck()
      }, [])

      useEffect(() => {
        if (user) {
          setMenuItems(loggedInMenu)

        } else {
          setMenuItems(publicMenu)
        }
        
      }, [user])

      
    
      return (
        <Navbar disableAnimation={true} isBordered onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
          </NavbarContent>
    
          <NavbarContent className="sm:hidden pr-3" justify="center">
            <NavbarBrand>
              
              {/* <p className="font-bold text-inherit">ACME</p> */}
            </NavbarBrand>
          </NavbarContent>
    
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarBrand>
              
              <p className="font-bold text-inherit">Logo</p>
            </NavbarBrand>
            <NavbarItem>
              <Link color="foreground" href="#">
                Series
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page" color="warning">
                Genres
              </Link>
            </NavbarItem>
            {/* <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem> */}
          </NavbarContent>
    
          <NavbarContent justify="end">
            <NavbarItem>
              {/* <NavSearch setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen}></NavSearch> */}
              <PbNavSearch></PbNavSearch>
            </NavbarItem>
            <NavbarItem>
              <BookmarkBtn></BookmarkBtn>
            </NavbarItem>
            {/* <NavbarItem className="hidden lg:flex">
              <Link href="#">Login</Link>
            </NavbarItem> */}
            {/* <NavbarItem>
              <Button as={Link} color="primary" href="#" variant="flat">
                Sign Up
              </Button>
            </NavbarItem> */}
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
                  href={item.url}
                  size="lg"
                >
                  {item.name}
                </Link> :
                <>
                <Divider className="my-4" />
                <Button className="w-full" size="md" color={`${item.name === 'Sign Out' ? 'danger' : 'primary'}`} onPress={item?.func}>
                {item.name}
                </Button>
                </>
                
                }
              </NavbarMenuItem>
            )})}
          </NavbarMenu>
        </Navbar>
      );
}