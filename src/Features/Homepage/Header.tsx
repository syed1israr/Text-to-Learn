'use client'

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"

const Header = () => {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex gap-3 items-center shrink-0">
          <Image src={"/logo.svg"} alt="Logo" width={40} height={40} className="w-10 h-10"/>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            <span className="text-primary">AZ</span>Task
          </h2>
        </div>
        <nav className="hidden md:flex gap-8 items-center flex-1 ml-8">
          <a href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200">Home</a>
          <a href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200">Pricing</a>
          <a href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200">Support</a>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header