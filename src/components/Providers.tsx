'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "./theme-provider"

import axios from "axios"
import { useEffect, useState } from "react"
import { UserDetailContext } from '@/hooks/userContext'
export const Providers = ({ children } : { children : React.ReactNode} ) =>{
    const [User, setUser] = useState(null)

    const createNewUser = async () =>{
        console.log("creating user func called");
        const res = await axios.post("/api/user",{});
        console.log(res.data)
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
                        {children}
                    </div>
                </UserDetailContext.Provider>
                </ThemeProvider>
        </ClerkProvider>
    )
}