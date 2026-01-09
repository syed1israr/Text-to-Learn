import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Course } from '@/lib/types'
import { Player } from '@remotion/player'
import { BookMarked, ChevronRight, Clock, Play, X } from 'lucide-react'
import { useState } from 'react'
import { CourseComposition } from './ChapterVideo'

const Chapters =({course,durationBySlide} : {course:Course | undefined,durationBySlide:Record<string,number>|null} ) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())
  const [playingChapter, setPlayingChapter] = useState<number | null>(null)

  const toggleCompleted = (index: number) => {
    const newCompleted = new Set(completedChapters)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedChapters(newCompleted)
  }
  const slides = course?.chapterContentSlides??[];
  const getChapterinDuration = (chapterId:string) =>{
    if( !durationBySlide || !course ) return 30;
    return course.chapterContentSlides.filter((s) => s.chapterId === chapterId).reduce((s,sl) => s + (durationBySlide[sl.slideId] ?? 30),0);
  }
  return (
    <div className='w-full bg-linear-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 py-24 relative overflow-hidden'>
        {/* Decorative elements */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl'></div>

        <div className='max-w-6xl mx-auto px-6 md:px-12 relative z-10'>
            <div className='text-center mb-16'>
                <div className='inline-block mb-4 px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full border border-indigo-200 dark:border-indigo-800'>
                    <p className='text-sm font-semibold text-indigo-700 dark:text-indigo-300'>Complete Your Journey</p>
                </div>
                <h2 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 mb-4'>
                    Course Curriculum
                </h2>
                <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {course?.courseLayout.chapters.length} comprehensive chapters designed for progressive mastery
                </p>
                {/* Progress bar */}
                <div className='mt-8 w-full max-w-md mx-auto'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Course Progress</span>
                        <span className='text-sm font-bold text-indigo-600 dark:text-indigo-400'>{Math.round((completedChapters.size / (course?.courseLayout.chapters.length || 1)) * 100)}%</span>
                    </div>
                    <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                        <div className='h-full bg-linear-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500' style={{width: `${(completedChapters.size / (course?.courseLayout.chapters.length || 1)) * 100}%`}}></div>
                    </div>
                </div>
            </div>
            
            <div className='grid gap-5'>
                {course?.courseLayout.chapters.map((m,i) => (
                    <div key={i} className='group relative'>
                        {/* Glow effect */}
                        <div className='absolute -inset-1 bg-linear-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500'></div>
                        
                        <Card className={`relative border-0 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                          completedChapters.has(i) 
                            ? 'bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg' 
                            : 'bg-white dark:bg-slate-800 hover:shadow-2xl'
                        }`} onClick={() => setExpandedChapter(expandedChapter === i ? null : i)}>
                            <CardHeader className='pb-4 pt-6 px-6 md:px-8'>
                                <div className='flex gap-5 items-center justify-between'>
                                    <div className='flex gap-5 items-start flex-1'>
                                        {/* Chapter number badge */}
                                        <div className='relative shrink-0'>
                                            <div className='absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition'></div>
                                            <div className={`relative flex items-center justify-center h-16 w-16 rounded-xl font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                                              completedChapters.has(i)
                                                ? 'bg-linear-to-br from-green-500 to-emerald-600 text-white'
                                                : 'bg-linear-to-br from-indigo-500 to-purple-600 text-white'
                                            }`}>
                                              {completedChapters.has(i) ? '✓' : i + 1}
                                            </div>
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                          <CardTitle className={`text-2xl md:text-2xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${completedChapters.has(i) ? 'line-through opacity-70' : ''}`}>
                                              {m.chapterTitle}
                                          </CardTitle>
                                          <div className='flex gap-4 mt-2 flex-wrap'>
                                            <span className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                                              <Clock className='w-4 h-4'/>
                                              ~{m.subContent.length * 8} min
                                            </span>
                                            <span className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                                              <BookMarked className='w-4 h-4'/>
                                              {m.subContent.length} lessons
                                            </span>
                                          </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform duration-300 shrink-0 ${expandedChapter === i ? 'rotate-90' : ''}`}/>
                                </div>
                            </CardHeader>

                            {/* Expanded content */}
                            {expandedChapter === i && (
                              <CardContent className='px-6 md:px-8 pb-8 pt-0 border-t border-gray-100 dark:border-gray-700'>
                                <div className='space-y-4 mt-6'>
                                    {m.subContent.map((n, idx) => (
                                        <div key={idx} className='flex gap-4 items-start group/item p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors'>
                                            <div className='shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold group-hover/item:scale-110 transition-transform'>
                                                {idx + 1}
                                            </div>
                                            <span className='text-gray-700 dark:text-gray-300 leading-relaxed flex-1'>
                                                {n}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                
                                {playingChapter === i ? (
                                  <div className='mt-6 space-y-3'>
                                    <div className='relative w-full bg-black rounded-xl overflow-hidden'>
                                        <Player
                                        component={CourseComposition}
                                        durationInFrames={getChapterinDuration(m.chapterId)}
                                        compositionWidth={1280}
                                        compositionHeight={720}
                                        fps={30}
                                        controls
                                        inputProps={{
                                        slides: slides.filter(s => s.chapterId === m.chapterId),
                                        durationsBySlideId:durationBySlide ?? {}
                                        }}
                                      />
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setPlayingChapter(null)
                                      }}
                                      className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all'>
                                      <X className='w-5 h-5'/>
                                      Close Video
                                    </button>
                                  </div>
                                ) : (
                                  <div className='flex gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700'>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setPlayingChapter(i)
                                      }}
                                      className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 group-hover:shadow-2xl'>
                                        <Play className='w-5 h-5'/>
                                        <span>Watch Chapter</span>
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleCompleted(i)
                                      }}
                                      className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                                        completedChapters.has(i)
                                          ? 'bg-green-500 text-white hover:bg-green-600'
                                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                      }`}>
                                      {completedChapters.has(i) ? '✓ Done' : 'Mark Done'}
                                    </button>
                                  </div>
                                )}
                            </CardContent>
                            )}
                        </Card>
                    </div>
                ))}
            </div>

            {/* Completion message */}
            {completedChapters.size === course?.courseLayout.chapters.length && course?.courseLayout.chapters.length > 0 && (
              <div className='mt-12 p-8 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-200 dark:border-green-800 text-center'>
                <p className='text-2xl font-bold text-green-700 dark:text-green-400'>🎉 Congratulations!</p>
                <p className='text-green-600 dark:text-green-300 mt-2'>You've completed all chapters. You're a superstar!</p>
              </div>
            )}
        </div>
    </div>
  )
}

export default Chapters