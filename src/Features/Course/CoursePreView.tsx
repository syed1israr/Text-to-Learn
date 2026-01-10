'use client'

import { Course } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import Chapters from "./Chapters";
import { toast } from "sonner";
import { getAudioData } from "@remotion/media-utils";
import GenerationAnimation from "./GenerationAnimation";
import { Player } from '@remotion/player';
import { CourseComposition } from './ChapterVideo';

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



  

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [videoMode, setVideoMode] = useState<'course' | 'chapter' | null>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)

  const selectedChapterSlides = selectedChapter !== null && courseDetails
    ? courseDetails.chapterContentSlides.filter(s => s.chapterId === courseDetails.courseLayout.chapters[selectedChapter]?.chapterId)
    : []

  const getSelectedChapterDuration = () => {
    if (selectedChapter === null || !courseDetails || !durationBySlide) return 30
    const chapter = courseDetails.courseLayout.chapters[selectedChapter]
    if (!chapter) return 30
    return courseDetails.chapterContentSlides
      .filter(s => s.chapterId === chapter.chapterId)
      .reduce((acc, s) => acc + (durationBySlide[s.slideId] ?? 30), 0)
  }


  const courseDurationInFrames = useMemo(() => {
    if (!durationBySlide) return 0
    const GAP_FRAMES = Math.round(1 * fps)
    return slides.reduce((sum, slide, idx) => {
      const dur = durationBySlide[slide.slideId] ?? fps * 6
      const gap = idx === slides.length - 1 ? 0 : GAP_FRAMES
      return sum + dur + gap
    }, 0)
  }, [durationBySlide, slides, fps])

  return (
    <>
      {isGenerating && (
        <GenerationAnimation
          currentChapter={generationProgress.current}
          totalChapters={generationProgress.total}
          message={generationProgress.message}
        />
      )}
      <div className="w-full min-h-screen bg-background pt-20">
        {courseDetails && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Course Header */}
            <div className="mb-12 space-y-3">
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
                {courseDetails.courseName}
              </h1>
              <p className="text-base text-muted-foreground max-w-3xl">
                {courseDetails.courseLayout.courseDescription}
              </p>
              <div className="flex gap-3 items-center text-sm">
                <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded">
                  {courseDetails.courseLayout.level}
                </span>
                <span className="text-muted-foreground">
                  {courseDetails.courseLayout.totalChapters} modules
                </span>
              </div>
            </div>

            {/* Main Video Section - Full Width */}
            {durationBySlide && slides.length > 0 && (
              <div ref={videoSectionRef} className="mb-12 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {videoMode === 'chapter' && selectedChapter !== null 
                      ? courseDetails.courseLayout.chapters[selectedChapter]?.chapterTitle
                      : 'Full Course Preview'}
                  </h2>
                  {videoMode === 'chapter' && (
                    <button
                      onClick={() => {
                        setVideoMode(null)
                        setSelectedChapter(null)
                      }}
                      className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      Show Full Course
                    </button>
                  )}
                </div>
                
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
                  <Player
                    component={CourseComposition}
                    inputProps={{
                      slides: videoMode === 'chapter' && selectedChapter !== null && selectedChapterSlides.length > 0
                        ? selectedChapterSlides
                        : slides,
                      durationsBySlideId: durationBySlide ?? {}
                    }}
                    durationInFrames={
                      videoMode === 'chapter' && selectedChapter !== null
                        ? getSelectedChapterDuration()
                        : courseDurationInFrames || 30
                    }
                    compositionWidth={1280}
                    compositionHeight={720}
                    fps={30}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </div>
            )}
            
            {!durationBySlide && slides.length === 0 && (
              <div className="mb-12 p-12 text-center border border-border rounded-lg">
                <p className="text-muted-foreground">Course content is being generated. Please wait...</p>
              </div>
            )}

            {/* Chapters List - Below Video */}
            <Chapters 
              course={courseDetails} 
              durationBySlide={durationBySlide}
              onChapterSelect={(index) => {
                setSelectedChapter(index)
                setVideoMode('chapter')
                // Scroll to video section smoothly
                setTimeout(() => {
                  videoSectionRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  })
                }, 100)
              }}
            />
          </div>
        )}
      </div>
    </>
  )

}

export default CoursePreView