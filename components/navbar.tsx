"use client"

import { Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { getSession, signOut } from "@/lib/auth/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"
import SignOutBtn from "./ui/sign-out-btn"
import { useSession } from "@/lib/auth/auth-client"

//server side component can be async but not client side comp.
const Navbar = () => {
  const {data :session} = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Briefcase />
          Job Tracker
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Dashbaord
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div>
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    
                    <SignOutBtn />
                    
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-black"
                >
                  Login In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90">
                  Start for free
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar