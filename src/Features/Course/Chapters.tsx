import { Course } from '@/lib/types'
import { Player } from '@remotion/player'
import {
  BookOpen,
  ChevronDown,
  Clock,
  Play,
  X,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'
import { CourseComposition } from './ChapterVideo'
import NotesView from './NotesView'

type ContentMode = 'notes' | 'video' | null

const Chapters = ({
  course,
  durationBySlide,
  onChapterSelect,
}: {
  course: Course | undefined
  durationBySlide: Record<string, number> | null
  onChapterSelect?: (index: number) => void
}) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())
  const [playingChapter, setPlayingChapter] = useState<number | null>(null)
  const [contentMode, setContentMode] = useState<ContentMode>(null)

  const [showNotes, setShowNotes] = useState<{
    chapterIndex: number
    subContentIndex: number
  } | null>(null)

  /* ---------------- Helpers ---------------- */

  const toggleCompleted = (index: number) => {
    const next = new Set(completedChapters)
    next.has(index) ? next.delete(index) : next.add(index)
    setCompletedChapters(next)
  }

  const slides = course?.chapterContentSlides ?? []

  const getChapterDuration = (chapterId: string) => {
    if (!course || !durationBySlide) return 30
    return course.chapterContentSlides
      .filter(s => s.chapterId === chapterId)
      .reduce((acc, s) => acc + (durationBySlide[s.slideId] ?? 30), 0)
  }

  const getSlidesForChapter = (chapterId: string) => {
    if (!course) return []
    return course.chapterContentSlides
      .filter(s => s.chapterId === chapterId)
      .sort((a, b) => a.slideIndex - b.slideIndex)
  }

  const progressPercentage = Math.round(
    (completedChapters.size /
      (course?.courseLayout.chapters.length || 1)) *
      100
  )

  const handleSubTopicClick = (chapterIndex: number, subContentIndex: number) => {
    const chapter = course?.courseLayout.chapters[chapterIndex]
    if (!chapter) return

    const chapterSlides = getSlidesForChapter(chapter.chapterId)
    if (!chapterSlides.length) return

    setContentMode('notes')
    setShowNotes({
      chapterIndex,
      subContentIndex: Math.min(subContentIndex, chapterSlides.length - 1),
    })
  }

  const videoReady =
  durationBySlide &&
  Object.keys(durationBySlide).length > 0;

  const handleChapterToggle = (index: number) => {
    // Explicitly set only the clicked chapter as expanded, or null if it's already expanded
    setExpandedChapter(prev => prev === index ? null : index)
  }

  /* ---------------- Render ---------------- */

  return (
    <section className="relative w-full py-8">
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-3xl text-neon-cyan uppercase tracking-tight">
              Course Modules
            </h2>
            <span className="font-mono text-sm text-muted-foreground">
              {progressPercentage}% Complete
            </span>
          </div>
          
          <div className="relative h-3 bg-secondary overflow-hidden geometric-border">
            <div
              className="absolute top-0 left-0 h-full bg-primary shadow-neon transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 scan-line"></div>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course?.courseLayout.chapters.map((m, i) => (
              <div 
              key={m.chapterId || i} 
              className={`group relative glass-cyber geometric-border transition-all duration-300 hover-glow cursor-pointer ${
                completedChapters.has(i) 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border hover:border-primary'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                handleChapterToggle(i)
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors"></div>

              {/* Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`geometric-border glass-cyber w-12 h-12 flex items-center justify-center font-display font-black text-lg ${
                        completedChapters.has(i)
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-primary text-primary'
                      }`}>
                        {completedChapters.has(i) ? <CheckCircle2 className="w-6 h-6" /> : `0${i + 1}`}
                      </div>
                      <h3 className={`font-display font-bold text-xl transition-colors ${
                        completedChapters.has(i) 
                          ? 'text-primary/70 line-through' 
                          : 'text-foreground group-hover:text-primary'
                      }`}>
                        {m.chapterTitle.toUpperCase()}
                      </h3>
                    </div>
                    
                    <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        ~{m.subContent.length * 8} MIN
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        {m.subContent.length} LESSONS
                      </span>
                    </div>
                  </div>
                  
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform duration-300 shrink-0 ${
                      expandedChapter === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Expanded Content */}
                {expandedChapter === i && (
                  <div className="pt-4 mt-4 border-t border-border/50 space-y-4">
                    {/* Sub-topics */}
                    <div className="space-y-2">
                      {m.subContent.map((n, idx) => (
                        <div
                          key={idx}
                          onClick={e => {
                            e.stopPropagation()
                            handleSubTopicClick(i, idx)
                          }}
                          className="group/item p-3 glass-cyber geometric-border hover:border-primary transition-all cursor-pointer hover-glow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 w-8 h-8 geometric-border glass-cyber flex items-center justify-center text-primary font-mono font-bold text-sm group-hover/item:scale-110 transition-transform group-hover/item:border-primary">
                              {String(idx + 1).padStart(2, '0')}
                            </div>
                            <span className="font-mono text-sm text-foreground leading-relaxed group-hover/item:text-primary transition-colors">
                              {n}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          const chapterSlides = getSlidesForChapter(m.chapterId)
                          if (!chapterSlides.length) return
                          setContentMode('notes')
                          setShowNotes({
                            chapterIndex: i,
                            subContentIndex: 0,
                          })
                        }}
                        className="flex-1 geometric-border glass-cyber px-4 py-3 text-primary hover:bg-primary/10 font-mono font-bold text-sm uppercase tracking-wider transition-all hover-glow flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        NOTES
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (onChapterSelect) {
                            onChapterSelect(i)
                            // Scroll to top to show video
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }, 100)
                          } else {
                            setContentMode('video')
                            setPlayingChapter(i)
                          }
                        }}
                        disabled={!videoReady}
                        className="flex-1 geometric-border glass-cyber px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-mono font-bold text-sm uppercase tracking-wider transition-all hover-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-4 h-4" />
                        VIDEO
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          toggleCompleted(i)
                        }}
                        className={`geometric-border glass-cyber px-4 py-3 font-mono font-bold text-sm uppercase tracking-wider transition-all hover-glow ${
                          completedChapters.has(i)
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'border-border text-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {completedChapters.has(i) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          'DONE'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion */}
        {completedChapters.size ===
          course?.courseLayout.chapters.length && (
          <div className="text-center p-8 border mt-10">
            <Zap className="mx-auto mb-2" />
            <h3 className="font-display text-xl">Course Completed</h3>
          </div>
        )}
      </div>

      {/* Notes View */}
      {showNotes && course && (() => {
        const chapter =
          course.courseLayout.chapters[showNotes.chapterIndex]
        const chapterSlides = getSlidesForChapter(chapter.chapterId)
        if (!chapterSlides.length) return null

        return (
          <NotesView
            slides={chapterSlides}
            subContentTitle={
              chapter.subContent[showNotes.subContentIndex] || chapter.chapterTitle
            }
            initialSlideIndex={showNotes.subContentIndex}
            onClose={() => {
              setShowNotes(null)
              setContentMode(null)
            }}
          />
        )
      })()}
    </section>
  )
}

export default Chapters
