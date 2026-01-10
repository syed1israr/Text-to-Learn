import { Course } from '@/lib/types'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Play,
  Zap
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
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
  const expandedChapterRef = useRef<number | null>(null)
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
    if (!course || !durationBySlide) return 0
    return course.chapterContentSlides
      .filter(s => s.chapterId === chapterId)
      .reduce((acc, s) => acc + (durationBySlide[s.slideId] ?? 0), 0)
  }

  const formatDuration = (frames: number) => {
    if (!frames || frames === 0) return '0 min'
    const fps = 30
    const seconds = Math.round(frames / fps)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes === 0) {
      return `${seconds} sec`
    } else if (remainingSeconds === 0) {
      return `${minutes} min`
    } else {
      return `${minutes} min ${remainingSeconds} sec`
    }
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
  const handleChapterToggle = useCallback((index: number) => {
    setExpandedChapter(current => {
      if (current === index) {
        expandedChapterRef.current = null
        return null
      }
      expandedChapterRef.current = index
      return index
    })
  }, [])

  /* ---------------- Render ---------------- */

  return (
    <section className="w-full py-8">
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Course Modules
            </h2>
            <span className="text-sm text-muted-foreground">
              {progressPercentage}% Complete
            </span>
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course?.courseLayout.chapters.map((m, i) => {
            const chapterIndex = i // Explicitly capture index
            // Double check: use both state and ref to ensure accuracy
            const isExpanded = expandedChapter === chapterIndex && expandedChapterRef.current === chapterIndex
            const uniqueKey = `chapter-${m.chapterId || `idx-${chapterIndex}`}-${chapterIndex}`
            
            return (
              <div 
              key={uniqueKey}
              data-chapter-index={chapterIndex}
              className={`group border border-border rounded-lg transition-all cursor-pointer bg-card hover:border-primary/50 ${
                completedChapters.has(chapterIndex) 
                  ? 'bg-muted/50' 
                  : ''
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                // Get the index from the element's data attribute to be absolutely sure
                const clickedIndex = parseInt(e.currentTarget.getAttribute('data-chapter-index') || String(chapterIndex))
                // Only proceed if this is actually the clicked element
                if (clickedIndex === chapterIndex) {
                  handleChapterToggle(clickedIndex)
                }
              }}
            >
              {/* Header */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium ${
                        completedChapters.has(chapterIndex)
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-foreground'
                      }`}>
                        {completedChapters.has(chapterIndex) ? <CheckCircle2 className="w-5 h-5" /> : chapterIndex + 1}
                      </div>
                      <h3 className={`text-lg font-semibold transition-colors ${
                        completedChapters.has(chapterIndex) 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}>
                        {m.chapterTitle}
                      </h3>
                    </div>
                    
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(getChapterDuration(m.chapterId))}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {m.subContent.length} lessons
                      </span>
                    </div>
                  </div>
                  
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Expanded Content */}
                {isExpanded && expandedChapter === chapterIndex && (
                  <div className="pt-4 mt-4 border-t border-border space-y-4">
                    {/* Sub-topics */}
                    <div className="space-y-1.5">
                      {m.subContent.map((n, idx) => (
                        <div
                          key={idx}
                          onClick={e => {
                            e.stopPropagation()
                            handleSubTopicClick(chapterIndex, idx)
                          }}
                          className="group/item p-3 rounded hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted rounded">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-foreground leading-relaxed">
                              {n}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          const chapterSlides = getSlidesForChapter(m.chapterId)
                          if (!chapterSlides.length) return
                          setContentMode('notes')
                          setShowNotes({
                            chapterIndex: chapterIndex,
                            subContentIndex: 0,
                          })
                        }}
                        className="flex-1 px-3 py-2 text-sm text-foreground hover:bg-muted border border-border rounded transition-colors flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Notes
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (onChapterSelect) {
                            onChapterSelect(chapterIndex)
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }, 100)
                          } else {
                            setContentMode('video')
                            setPlayingChapter(chapterIndex)
                          }
                        }}
                        disabled={!videoReady}
                        className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-4 h-4" />
                        Video
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          toggleCompleted(chapterIndex)
                        }}
                        className={`px-3 py-2 text-sm border border-border rounded transition-colors ${
                          completedChapters.has(chapterIndex)
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {completedChapters.has(chapterIndex) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          'Done'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )
          })}
        </div>

        {/* Completion */}
        {completedChapters.size ===
          course?.courseLayout.chapters.length && (
          <div className="text-center p-8 border border-border rounded-lg mt-6">
            <Zap className="mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Course Completed</h3>
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
