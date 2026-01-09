'use client'

import { Course } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Chapters from "./Chapters";
import CourseInfoCard from "./CourseInfoCard";
import { toast } from "sonner";

const CoursePreView =  () => {
  const { courseId : id } = useParams();
  const [courseDetails, setcourseDetails] = useState<Course>()

  const courseHandler = async () => {
    const loadingToast = toast.loading("Fetching Course Detail");
    const res = await axios.get(`/api/course?courseId=${id}`);
    toast.success('course Detailed Fetched Successffuly ',{ id:loadingToast})
    setcourseDetails(res.data)
    if( res?.data?.chapterContentSlides.length === 0 ){
      generateVideoContent(res?.data)
    }
  }
  
  const generateVideoContent = async (course:Course) =>{
      

  console.log("course.courseLayout.chapters[0]"+ course.courseLayout.chapters[0])
    for(let i = 0; i < course.courseLayout.chapters.length; i++){
      if( i> 0) break; 
      const toastLoading = toast.loading("generating video Content for chapter " + (i + 1));
      const result = await axios.post("/api/video-content",{
      chapter:course.courseLayout.chapters[i],
      courseId:id
    })

    console.log("result of 35 preview",result.data)
    toast.success("Video Content Generated",{id:toastLoading})
    }
    
  } 


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