import { db } from "@/db";
import { chapterContentSlides, courseTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courseId = req.nextUrl.searchParams.get("courseId");

    if (!courseId) {
        return NextResponse.json(
            { error: "courseId is required" },
            { status: 400 }
        );
    }

    const res = await db
        .select()
        .from(courseTable)
        .where(eq(courseTable.courseId, courseId))
        .limit(1);

    const slides = await db
        .select()
        .from(chapterContentSlides)
        .where(eq(chapterContentSlides.courseId, courseId));

    return NextResponse.json({
        ...res[0],
        chapterContentSlides: slides,
    });
}
