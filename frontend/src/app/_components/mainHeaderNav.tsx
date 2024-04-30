'use client'

import { useEffect, useState } from "react"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Divider, Input } from "@nextui-org/react";
import BookmarkBtn from "./button/bookmark";
import PbNavSearch from "./button/pbSearch";
import homeIcon from '../apple-icon.png'
import NextImage from "next/image";
import { serverLogUserOut } from "../actions";
import { useAuth } from "../_contexts/authContext";
import { ThemeSwitcher } from "./themeSwitcher";
import { FaSearch } from "react-icons/fa";
import SlideSearchBar from "./button/slideSearch";

interface MenuItems {
  name: string,
  url?: string,
  type: string,
  func?: () => Promise<void>
}

export default function MainHeaderNav () {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItems[]>([])
    const [errorMsg, setErrorMsg] = useState('')
    const { user, setUser } = useAuth()

    const [isSearchOpen, setIsSearchOpen] = useState(false)
   
   

    const logUserOut = async () => {
      const isLogOutSuccessful = await serverLogUserOut()
      if (isLogOutSuccessful) {
        setMenuItems(publicMenu)
        setUser(null)
      } else {
        setErrorMsg('Encountered an error trying to logout.')
      }
    }

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

    

      useEffect(() => {
      
          if (user) {
            setMenuItems(loggedInMenu)
          } else {
            setMenuItems(publicMenu)
          }
          
      
        
      }, [user])


  
    
      return (
        <div className="flex flex-col items-center">
          
        <Navbar disableAnimation={true} isBordered position={'static'} onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} maxWidth="lg">
          <NavbarContent justify="start">
            <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
            <NavbarBrand>
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
            <NavbarItem>
            <Button isIconOnly aria-label="Toggle Searchbar" onPress={() => setIsSearchOpen(prev => !prev)}>
                <FaSearch></FaSearch>
            </Button>
              {/* <PbNavSearch></PbNavSearch> */}
            </NavbarItem>
            <NavbarItem>
              <BookmarkBtn></BookmarkBtn>
            </NavbarItem>
            <NavbarItem className="hidden sm:block">
            <ThemeSwitcher></ThemeSwitcher>
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
                  href={item.url} onClick={() =>setIsMenuOpen(false)}
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
            )})}
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