import { db } from "@/db";
import { courseTable } from "@/db/schema";
import { client } from "@/lib/config";
import { Course_config_prompt } from "@/lib/constant";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, courseId, type } = body;

    if (!userInput || !courseId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: Course_config_prompt },
        { role: "user", content: `Course Topic is ${userInput}` },
      ],
    });
    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }
    let parsedCourse;
    try {
      parsedCourse = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }
    if (!parsedCourse.courseName) {
      return NextResponse.json(
        { error: "Invalid course format from AI" },
        { status: 500 }
      );
    }
    try {
       await db.insert(courseTable).values({
         courseId,
         courseName: parsedCourse.courseName,
         userInput,
         type,
         courseLayout: parsedCourse,
         userId: email, 
       });
   } catch (dbError: unknown) {
      console.error("Database error:", dbError);
     if (dbError instanceof Error && dbError.message.includes('unique')) {
       return NextResponse.json(
        { error: "Course ID already exists" },
          { status: 409 }
      );
      }
     if (dbError instanceof Error && dbError.message.includes('foreign key')) {
       return NextResponse.json(
        { error: "User not found" },          { status: 400 }
        );
    }
    throw dbError;
   }

    return NextResponse.json(parsedCourse, { status: 201 });

  } catch (error) {
    console.error("Course generation error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
