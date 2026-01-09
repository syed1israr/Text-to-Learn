'use client'

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import CourseInfoCard from "./CourseInfoCard";
import { Course } from "@/lib/types";
import Chapters from "./Chapters";

const CoursePreView =  () => {
  const { courseId : id } = useParams();
  const [courseDetails, setcourseDetails] = useState<Course>()

  const courseHandler = async () => {
    const res = await axios.get(`/api/course?courseId=${id}`)
    setcourseDetails(res.data)
  }
  console.log("CourseDetails",courseDetails)
  useEffect(() =>{
    id && courseHandler();
  },[id])
  return (
    <div className="w-full">
      <CourseInfoCard course={courseDetails}/>
      <Chapters course={courseDetails} />
    </div>
  )

}

export default CoursePreView