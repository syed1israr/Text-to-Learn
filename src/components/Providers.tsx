'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "./theme-provider"
import Header from '@/Features/Homepage/Header'
import { UserDetailContext } from '@/hooks/userContext'
import axios from "axios"
import { useEffect, useState } from "react"

export const Providers = ({ children } : { children : React.ReactNode} ) =>{
    const [User, setUser] = useState(null)
    const createNewUser = async () =>{
        const res = await axios.post("/api/user",{});
        setUser(res.data)
    }
    useEffect(()=>{
        createNewUser();
    },[])
    return(
        <ClerkProvider>
                <ThemeProvider
                attribute={"class"}
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                >
                <UserDetailContext.Provider value={{User,setUser}}>
                    <div>
                        <Header/>
                        {children}
                    </div>
                </UserDetailContext.Provider>
                </ThemeProvider>
        </ClerkProvider>
    )
}