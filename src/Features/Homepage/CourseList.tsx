"use client"
import { Course } from '@/lib/types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseListCard from '../Course/CourseListCard'
import { Database, Loader2 } from 'lucide-react'

const CourseList = () => {
  const [courseList, setcourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const getCourseList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/course");
      console.log("course Created by user",res.data)
      setcourseList(res.data)
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ getCourseList();},[])
  
  return (
    <section className='w-full py-16 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Section header */}
        <div className='mb-10 space-y-2'>
          <h2 className='text-3xl font-semibold text-foreground'>
            My Courses
          </h2>
          <p className='text-sm text-muted-foreground'>
            Access your generated courses and learning modules
          </p>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-3'>
              <Loader2 className='w-8 h-8 text-muted-foreground animate-spin mx-auto'/>
              <p className='text-sm text-muted-foreground'>Loading courses...</p>
            </div>
          </div>
        ) : courseList.length === 0 ? (
          <div className='border border-border rounded-lg p-12 text-center'>
            <Database className='w-12 h-12 text-muted-foreground/40 mx-auto mb-3'/>
            <p className='text-sm text-muted-foreground'>No courses found. Generate your first course above.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {courseList.map((c,idx) => (
              <CourseListCard courseItem={c} key={idx}/>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CourseList