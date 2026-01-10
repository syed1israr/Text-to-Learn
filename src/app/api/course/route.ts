import { db } from "@/db";
import { chapterContentSlides, courseTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

 export async function GET(req: NextRequest) {
     const courseId = req.nextUrl.searchParams.get("courseId");
     const user = await currentUser();

     if (!courseId) {
        
        const userCourses = await db.select().from(courseTable).where(
            eq(courseTable.userId,user?.primaryEmailAddress?.emailAddress as string)
        ).orderBy(desc(courseTable.id));
        
        return NextResponse.json(userCourses)
     }
 
    try {
         const res = await db
             .select()
             .from(courseTable)
             .where(eq(courseTable.courseId, courseId))
             .limit(1);

          if (!res[0]) {
              return NextResponse.json(
                 { error: "Course not found" },
                  { status: 404 }
              );
          }
 
         const slides = await db
             .select()
             .from(chapterContentSlides)
             .where(eq(chapterContentSlides.courseId, courseId))
  .orderBy(
    asc(chapterContentSlides.chapterId),
    asc(chapterContentSlides.slideIndex),
    asc(chapterContentSlides.id),
  );
 
         return NextResponse.json({
             ...res[0],
             chapterContentSlides: slides,
         });
      } catch (error) {
          console.error("Database error:", error);
          return NextResponse.json(
              { error: "Failed to fetch course data" },
              { status: 500 }
          );
      }
 }