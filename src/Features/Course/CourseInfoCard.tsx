import { Course } from '@/lib/types'
import { Player } from '@remotion/player'
import { Award, BookOpen, ChartNoAxesColumnIncreasing, Loader2Icon, SparkleIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CourseComposition } from './ChapterVideo'
const CourseInfoCard = ({course,durationBySlide} : {course:Course | undefined,durationBySlide:Record<string,number>|null} ) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
    const fps = 30;
    const slides = course?.chapterContentSlides??[];

    console.log("durationBySlide", durationBySlide);



const durationInFrames = useMemo(() => {
  if (!durationBySlide) return 0;

  return slides.reduce((sum, slide) => {
    return sum + (durationBySlide[slide.slideId] ?? fps * 6);
  }, 0);
}, [durationBySlide, slides, fps]);

console.log("durationInFrames", durationInFrames);

if( !durationBySlide ){
    return <Loader2Icon/>
}
  return (
    <div className='w-full min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center overflow-hidden relative'>
        {/* Animated background elements */}
        <div className='absolute top-10 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-10 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        
        <div className='max-w-6xl mx-auto w-full px-6 md:px-12 py-20 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                
                {/* Left Side - Content */}
                <div className='space-y-8 animate-fade-in'>
                    <div className='space-y-2'>
                        <div className='inline-block'>
                            <span className='inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold border border-indigo-200 dark:border-indigo-800'>
                                <SparkleIcon className='w-4 h-4'/>
                                Premium Course
                            </span>
                        </div>
                        <h1 className='text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight'>
                            {course?.courseName}
                        </h1>
                    </div>
                    
                    <p className='text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl'>
                        {course?.courseLayout.courseDescription}
                    </p>
                    
                    <div className='grid grid-cols-2 gap-3 pt-4'>
                        <div className='flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all cursor-pointer'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-emerald-400 to-teal-600 text-white'>
                                <ChartNoAxesColumnIncreasing className='w-5 h-5'/>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Level</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>{course?.courseLayout.level}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all cursor-pointer'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-indigo-600 text-white'>
                                <BookOpen className='w-5 h-5'/>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Chapters</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>{course?.courseLayout?.totalChapters}</p>
                            </div>
                        </div>

                        {/* <div className='flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all cursor-pointer'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 text-white'>
                                <Users className='w-5 h-5'/>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Students</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>2.5K+</p>
                            </div>
                        </div> */}

                        <div className='flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all cursor-pointer'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-yellow-400 to-amber-600 text-white'>
                                <Award className='w-5 h-5'/>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Rating</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>4.9★</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setIsVideoOpen(!isVideoOpen)} className='group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg'>
                        <span className='relative'>
                            <span className='absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 group-hover:blur-md transition duration-500'></span>
                            <span className='relative'>▶</span>
                        </span>
                        Start Learning
                        <span className='group-hover:translate-x-1 transition'>→</span>
                    </button>
                </div>
                
                {/* Right Side - Visual Showcase */}
                <div className='relative h-96 hidden lg:flex items-center justify-center'>
                    <div className='absolute inset-0 bg-linear-to-r from-indigo-600/30 to-purple-600/30 rounded-3xl blur-3xl'></div>
                    <div className='absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl border border-indigo-200/50 dark:border-indigo-900/50 backdrop-blur-lg'></div>
                    
                    {isVideoOpen ? (
                      <div className='relative w-full h-full rounded-3xl overflow-hidden'>
                        <Player
                          component={CourseComposition}
                          inputProps={{
                            slides:slides,
                            durationsBySlideId:durationBySlide
                          }}
                          durationInFrames={durationInFrames || 30}
                          compositionWidth={1280}
                          compositionHeight={720}
                          fps={30}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "24px"
                          }}
                        />
                      </div>
                    ) : (
                      <div className='relative text-center space-y-4'>
                        <div className='inline-block'>
                            <div className='w-24 h-24 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform'>
                                <BookOpen className='w-12 h-12 text-white'/>
                            </div>
                        </div>
                        <p className='text-indigo-600/80 dark:text-indigo-400/80 text-lg font-semibold'>Interactive Learning</p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 max-w-xs'>Engage with dynamic content and video lessons</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CourseInfoCard