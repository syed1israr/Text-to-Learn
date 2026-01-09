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
    <section className='relative w-full py-20 px-4 md:px-8'>
      {/* Section background effects */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent'></div>
      
      <div className='relative max-w-7xl mx-auto'>
        {/* Section header */}
        <div className='mb-12 space-y-4'>
          <div className='inline-block geometric-border glass-cyber px-4 py-2 mb-4'>
            <span className='font-mono text-xs text-primary tracking-widest uppercase'>Course Database</span>
          </div>
          
          <div className='flex items-center gap-4'>
            <div className='h-px flex-1 bg-gradient-to-r from-primary to-transparent'></div>
            <h2 className='font-display font-black text-4xl md:text-5xl text-neon-cyan uppercase tracking-tight'>
              Course Matrix
            </h2>
            <div className='h-px flex-1 bg-gradient-to-l from-primary to-transparent'></div>
          </div>
          
          <p className='font-mono text-sm text-muted-foreground text-center max-w-2xl mx-auto'>
            Access your generated course matrices and learning modules
          </p>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <Loader2 className='w-12 h-12 text-primary animate-spin mx-auto'/>
              <p className='font-mono text-sm text-muted-foreground'>Loading course database...</p>
            </div>
          </div>
        ) : courseList.length === 0 ? (
          <div className='glass-cyber geometric-border p-12 text-center'>
            <Database className='w-16 h-16 text-muted-foreground/30 mx-auto mb-4'/>
            <p className='font-mono text-muted-foreground'>No courses found. Generate your first course matrix above.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
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