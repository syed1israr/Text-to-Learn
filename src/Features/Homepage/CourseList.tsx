"use client"
import { Course } from '@/lib/types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseListCard from '../Course/CourseListCard'

const CourseList = () => {
  const [courseList, setcourseList] = useState<Course[]>([]);

  const getCourseList = async () => {
    const res = await axios.get("/api/course");
    console.log("course Created by user",res.data)
    setcourseList(res.data)
  }

  useEffect(()=>{ getCourseList();},[])
  return (
    <div className='max-w-9xl p-2 '>
      <h2 className='font-bold text-2xl'> My Courses</h2>


      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 mt-5 gap-5'>
        {courseList.map((c,idx) => (
          <CourseListCard courseItem={c} key={idx}/>
        ))}
      </div>
    </div>
  )
}

export default CourseList