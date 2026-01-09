import { integer, pgTable, varchar, timestamp, json, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(2),
});

export const courseTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull().references(()=>usersTable.email),
  courseId: varchar({ length: 255 }).notNull().unique(),
  courseName: varchar({ length: 255 }).notNull(),
  userInput: varchar({ length: 1024 }).notNull(),
  type: varchar({ length: 100 }).notNull(),
  courseLayout: json(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
});


export const chaptersTable = pgTable("chapters",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: varchar({ length: 255 }).notNull().references(() => courseTable.courseId),
    chapterId: varchar({ length: 255 }).notNull().unique(),
    chapterTitle: varchar({ length: 255 }).notNull(),
    videoContent: json(),
    captions:json(),
    audioFileurl: varchar({ length:1024}),
    createdAt: timestamp({ mode: "date" }).defaultNow(),
})


export const chapterContentSlides = pgTable("chapter_content_slides",{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: varchar({ length: 255 }).notNull(),
    chapterId: varchar({ length: 255 }).notNull(),
    slideId: varchar({ length:255 }).notNull(),
    slideIndex: integer().notNull(),
    audioFileName: varchar({length:255}).notNull(),
    narration: json().notNull(),
    html: text(),
    revelData: json().notNull(),
    audioFileUrl: varchar({ length:1024}).notNull()
})