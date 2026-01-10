'use client'

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              router.replace("/");
              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 100);
            }}
            
          >
            <div className="text-2xl font-semibold text-foreground">
              Text-to-Learn
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline"> <span className="text-primary">AI-Powered</span>  Course Generator</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => router.push("/")}
              className="px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                router.push("/");
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }}
              className="px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              Courses
            </button>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button className="h-9 px-4 text-sm font-medium">
                  Get Started
                </Button>
              </SignInButton>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-2">
            <nav className="flex flex-col">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/");
                }}
                className="px-4 py-2 text-sm text-foreground hover:bg-muted text-left transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/");
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 100);
                }}
                className="px-4 py-2 text-sm text-foreground hover:bg-muted text-left transition-colors"
              >
                Courses
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header