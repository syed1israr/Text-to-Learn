'use client'

import { Course } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Chapters from "./Chapters";
import CourseInfoCard from "./CourseInfoCard";
import { toast } from "sonner";
import { getAudioData } from "@remotion/media-utils";

const CoursePreView =  () => {
  const { courseId : id } = useParams();
  const [courseDetails, setcourseDetails] = useState<Course>()

const courseHandler = async () => {
    const loadingToast = toast.loading("Fetching Course Detail");
    try {
      const res = await axios.get(`/api/course?courseId=${id}`);
      toast.success('Course Details Fetched Successfully', { id: loadingToast });
      setcourseDetails(res.data);
      
      if (res?.data?.chapterContentSlides?.length === 0) {
        await generateVideoContent(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch course details', { id: loadingToast });
      console.error('Error fetching course:', error);
    }
  }

  
  const generateVideoContent = async (course:Course) =>{
    try {
      for(let i = 0; i < course.courseLayout.chapters.length; i++){
        
        const toastLoading = toast.loading(`Generating video content for chapter ${i + 1}`);
        try {
          const result = await axios.post("/api/video-content", {
            chapter: course.courseLayout.chapters[i],
            courseId: id
          });
          
          toast.success("Video Content Generated, CHECK!CHECK!", { id: toastLoading });
          console.log("CHECK HERE FOR THE RESULT : " + result?.data?.audiFileUrl[0] )
        } catch (error) {
          toast.error(`Failed to generate content for chapter ${i + 1}`, { id: toastLoading });
          console.error(`Error generating video for chapter ${i}:`, error);
          
        }
      }
    } catch (error) {
      console.error('Error in generateVideoContent:', error);
      toast.error('Failed to generate video content');
    }
  } 


  useEffect(() =>{
    id && courseHandler();
  },[id])



      const fps = 30;
      const slides = courseDetails?.chapterContentSlides??[];
      const [durationBySlide, setdurationBySlide] = useState<Record<string,number>|null>(null);
  
  
     useEffect(() => {
    if (!slides.length) return;
  
    let cancelled = false;
  
    const run = async () => {
      try {
        const entries = await Promise.all(
                  slides.map(async (slide) => {
                  const audioData = await getAudioData(slide.audioFileUrl);
                  const frames = Math.max(
                      1,
                      Math.ceil(audioData.durationInSeconds * fps)
                  );
                  return [slide.slideId, frames] as const;
                  })
              );
  
              if (!cancelled) {
                  setdurationBySlide(Object.fromEntries(entries));
              }
              } catch (err) {
              console.error("Failed to compute slide durations", err);
              }
          };
  
          run();
  
          return () => {
              cancelled = true;
          };
          }, [slides, fps]);

  return (
    <div className="w-full">
      <CourseInfoCard course={courseDetails} durationBySlide={durationBySlide}/>
      <Chapters course={courseDetails}  durationBySlide={durationBySlide} />
    </div>
  )

}

export default CoursePreView