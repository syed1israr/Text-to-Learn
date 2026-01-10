import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST( req:NextRequest) {
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress;
    const userDB = await db.select().from(usersTable).where(
        eq(usersTable.email,email as string)
    )
    if( userDB.length === 0 ){
        const newUser = await db.insert(usersTable).values({
            name:clerkUser?.fullName as string,
            email:email as string,
         
        }).returning();
        
        return NextResponse.json({newUser : newUser[0]});
    }
    return NextResponse.json(userDB[0])
}