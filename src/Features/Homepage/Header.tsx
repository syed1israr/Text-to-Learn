'use client'

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Menu, X, Zap } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation";


const Header = () => {
  const { user } = useUser();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-neon border-neon/30 glass-cyber">
      <div className="relative">
        {/* Animated scan line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 scan-line"></div>
        
        <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8 max-w-7xl mx-auto">
          {/* Logo section */}
          <div className="flex gap-3 items-center shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 geometric-border flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-display font-bold text-neon-cyan tracking-tight leading-tight">
                TEXT-TO-LEARN
              </h1>
              <span className="text-xs text-muted-foreground font-mono tracking-wider">AI COURSE GENERATOR</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-1 items-center flex-1 justify-center ml-8">
            <a 
              onClick={() => router.push("/")}
              className="relative px-6 py-2 font-mono text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group"
            >
              <span className="relative z-10">HOME</span>
              <span className="absolute inset-0 border-l-2 border-r-2 border-transparent group-hover:border-primary transition-all duration-300"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a 
              onClick={() => {
                router.push("/");
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }}
              className="relative px-6 py-2 font-mono text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group"
            >
              <span className="relative z-10">COURSES</span>
              <span className="absolute inset-0 border-l-2 border-r-2 border-transparent group-hover:border-primary transition-all duration-300"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a 
               onClick={(e) => e.preventDefault()} 
              className="relative px-6 py-2 font-mono text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group"
            >
              <span className="relative z-10">LAB</span>
              <span className="absolute inset-0 border-l-2 border-r-2 border-transparent group-hover:border-primary transition-all duration-300"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4 ml-auto">
            {user ? (
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-md opacity-30"></div>
                <div className="relative">
                  <UserButton />
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="relative geometric-border bg-transparent hover:bg-primary/10 text-primary hover:text-primary font-mono font-semibold px-6 py-2 overflow-hidden group">
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    INITIALIZE
                  </span>
                </Button>
              </SignInButton>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                router.push("/");
              }}
              className="lg:hidden p-2 geometric-border text-primary hover:bg-primary/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neon/30 glass-cyber">
            <nav className="flex flex-col gap-1 p-4">
              <a 
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
                className="px-4 py-3 font-mono text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/10 transition-all border-l-2 border-transparent hover:border-primary"
              
              >
                HOME
              </a>
              <a 
                href="#" 
                className="px-4 py-3 font-mono text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/10 transition-all border-l-2 border-transparent hover:border-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                COURSES
              </a>
              <a 
                href="#" 
                className="px-4 py-3 font-mono text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/10 transition-all border-l-2 border-transparent hover:border-primary"
                onClick={(e) => e.preventDefault()}
              >
                LAB
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header