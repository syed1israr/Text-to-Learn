'use client'

import { Course } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Chapters from "./Chapters";
import CourseInfoCard from "./CourseInfoCard";
import { toast } from "sonner";
import { getAudioData } from "@remotion/media-utils";
import GenerationAnimation from "./GenerationAnimation";

const CoursePreView =  () => {
  const { courseId : id } = useParams();
  const [courseDetails, setcourseDetails] = useState<Course>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, message: '' })

  const fps = 30;
  const slides = courseDetails?.chapterContentSlides ?? [];
  const [durationBySlide, setdurationBySlide] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!slides.length) return;

    let cancelled = false;

    const run = async () => {
      try {
        const entries = await Promise.all(
          slides.map(async (slide) => {
            const audioData = await getAudioData(slide.audioFileUrl);
            const frames = Math.max(1, Math.ceil(audioData.durationInSeconds * fps));
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
    setIsGenerating(true)
    setGenerationProgress({ current: 0, total: course.courseLayout.chapters.length, message: 'Initializing generation...' })
    
    try {
      for(let i = 0; i < course.courseLayout.chapters.length; i++){
        setGenerationProgress({ 
          current: i + 1, 
          total: course.courseLayout.chapters.length, 
          message: `Generating content for chapter ${i + 1}: ${course.courseLayout.chapters[i].chapterTitle}`
        })
        
        try {
          const result = await axios.post("/api/video-content", {
            chapter: course.courseLayout.chapters[i],
            courseId: id
          });
          
          // If axios doesn't throw, the request was successful (status 200)
          // Check the response data structure
          if (result.data?.slides && Array.isArray(result.data.slides)) {
            console.log(`Chapter ${i + 1} slides generated:`, result.data.slides);
          } else if (result.data?.error) {
            // API returned an error in the response body (shouldn't happen with 200, but handle it)
            console.error(`Chapter ${i + 1} error:`, result.data.error);
            toast.error(`Chapter ${i + 1}: ${result.data.error}`);
          } else {
            // Success but unexpected format - log it but consider it successful
            console.log(`Chapter ${i + 1} response (unexpected format):`, result.data);
          }
        } catch (error: any) {
          // Handle axios errors
          if (error.response) {
            // Server responded with error status
            const errorMsg = error.response.data?.error || error.response.statusText || 'Unknown error';
            toast.error(`Chapter ${i + 1}: ${errorMsg}`);
            console.error(`Chapter ${i + 1} error (${error.response.status}):`, error.response.data);
          } else if (error.request) {
            // Request made but no response
            toast.error(`Chapter ${i + 1}: No response from server`);
            console.error(`Chapter ${i + 1} network error:`, error.request);
          } else {
            // Something else happened
            toast.error(`Chapter ${i + 1}: ${error.message}`);
            console.error(`Chapter ${i + 1} error:`, error.message);
          }
        }
      }
      
      // After all chapters are generated, refetch course data to get the new slides
      setGenerationProgress({ 
        current: course.courseLayout.chapters.length, 
        total: course.courseLayout.chapters.length, 
        message: 'Refreshing course data...' 
      })
      
      try {
        const res = await axios.get(`/api/course?courseId=${id}`);
        setcourseDetails(res.data);
        toast.success('Course content generated successfully!');
      } catch (error) {
        console.error('Error refetching course:', error);
        toast.error('Content generated but failed to refresh. Please reload the page.');
      }
    } catch (error) {
      console.error('Error in generateVideoContent:', error);
      toast.error('Failed to generate video content');
    } finally {
      setIsGenerating(false)
      setGenerationProgress({ current: 0, total: 0, message: '' })
    }
  } 


  useEffect(() =>{
    id && courseHandler();
  },[id])



  

  return (
    <>
      {isGenerating && (
        <GenerationAnimation
          currentChapter={generationProgress.current}
          totalChapters={generationProgress.total}
          message={generationProgress.message}
        />
      )}
      <div className="w-full">
        <CourseInfoCard course={courseDetails} durationBySlide={durationBySlide}/>
        <Chapters course={courseDetails}  durationBySlide={durationBySlide} />
      </div>
    </>
  )

}

export default CoursePreView