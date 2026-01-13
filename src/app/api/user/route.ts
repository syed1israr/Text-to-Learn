import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";




export async function POST( req:NextRequest) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        const email = clerkUser?.primaryEmailAddress?.emailAddress;
        if (!email) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        const userDB = await db.select().from(usersTable).where(
            eq(usersTable.email, email)
        );
        if (userDB.length === 0) {
            const newUser = await db.insert(usersTable).values({
                name: clerkUser?.fullName || 'User',
                email: email,
            }).returning();
            
            return NextResponse.json({ newUser: newUser[0] });
        }
        return NextResponse.json(userDB[0]);
    } catch (error) {
        console.error("Error in /api/user:", error);
        
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
