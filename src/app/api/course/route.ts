import { db } from "@/db";
import { courseTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req:NextRequest){
    const courseId = req.nextUrl.searchParams.get('courseId')

    const res = await db.select().from(courseTable).where(
        eq(courseTable.courseId,courseId as string)
    )

    return NextResponse.json(res[0]);
}