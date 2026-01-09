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
import SlideShow from './SlideShow'

type ContentMode = 'notes' | 'video' | null

const Chapters = ({
  course,
  durationBySlide,
}: {
  course: Course | undefined
  durationBySlide: Record<string, number> | null
}) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())
  const [playingChapter, setPlayingChapter] = useState<number | null>(null)
  const [contentMode, setContentMode] = useState<ContentMode>(null)

  const [showSlideshow, setShowSlideshow] = useState<{
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
    setShowSlideshow({
      chapterIndex,
      subContentIndex: Math.min(subContentIndex, chapterSlides.length - 1),
    })
  }

  const videoReady =
  durationBySlide &&
  Object.keys(durationBySlide).length > 0;

  /* ---------------- Render ---------------- */

  return (
    <section className="relative w-full py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Progress */}
        <div className="text-center space-y-4">
          <h2 className="font-display text-4xl text-primary">Course Matrix</h2>
          <p className="font-mono text-sm text-muted-foreground">
            {course?.courseLayout.chapters.length} modules
          </p>

          <div className="w-full max-w-xl mx-auto">
            <div className="h-2 bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {course?.courseLayout.chapters.map((m, i) => (
            <div key={i} className="glass-cyber geometric-border">
              {/* Header */}
              <div
                className="p-6 flex justify-between cursor-pointer"
                onClick={() =>
                  setExpandedChapter(expandedChapter === i ? null : i)
                }
              >
                <div>
                  <h3 className="font-display text-xl">
                    {m.chapterTitle.toUpperCase()}
                  </h3>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.subContent.length * 8} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {m.subContent.length} lessons
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`transition ${
                    expandedChapter === i ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Expanded */}
              {expandedChapter === i && (
                <div className="border-t border-border px-6 pb-6 space-y-6">
                  {/* Sub-topics */}
                  <div className="space-y-2 pt-4">
                    {m.subContent.map((n, idx) => (
                      <div
                        key={idx}
                        onClick={e => {
                          e.stopPropagation()
                          handleSubTopicClick(i, idx)
                        }}
                        className="p-3 cursor-pointer hover:bg-primary/10"
                      >
                        {idx + 1}. {n}
                      </div>
                    ))}
                  </div>

                  {/* Modes */}
                  {playingChapter === i && contentMode === 'video' && videoReady  ? (
                    <>
                      <Player
                        component={CourseComposition}
                        durationInFrames={getChapterDuration(m.chapterId)}
                        compositionWidth={1280}
                        compositionHeight={720}
                        fps={30}
                        controls
                        inputProps={{
                          slides: slides.filter(
                            s => s.chapterId === m.chapterId
                          ),
                          durationsBySlideId: durationBySlide ?? {},
                        }}
                      />
                      <button
                        onClick={() => {
                          setPlayingChapter(null)
                          setContentMode(null)
                        }}
                        className="w-full mt-4 border px-4 py-2"
                      >
                        <X className="inline w-4 h-4 mr-2" />
                        Close Video
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-4 pt-4 border-t">
                      {/* Read Notes */}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          const chapterSlides = getSlidesForChapter(m.chapterId)
                          if (!chapterSlides.length) return
                          setContentMode('notes')
                          setShowSlideshow({
                            chapterIndex: i,
                            subContentIndex: 0,
                          })
                        }}
                        className="flex-1 border px-4 py-3 flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read Notes
                      </button>

                      {/* Watch Video */}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setContentMode('video')
                          setPlayingChapter(i)
                        }}
                        className="flex-1 border px-4 py-3 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Watch Video
                      </button>

                      {/* Mark Done */}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          toggleCompleted(i)
                        }}
                        className="border px-4 py-3"
                      >
                        {completedChapters.has(i) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          'Done'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
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

      {/* Slideshow */}
      {showSlideshow && course && (() => {
        const chapter =
          course.courseLayout.chapters[showSlideshow.chapterIndex]
        const chapterSlides = getSlidesForChapter(chapter.chapterId)
        if (!chapterSlides.length) return null

        return (
          <SlideShow
            slides={chapterSlides}
            subContentTitle={
              chapter.subContent[showSlideshow.subContentIndex]
            }
            initialSlideIndex={showSlideshow.subContentIndex}
            onClose={() => {
              setShowSlideshow(null)
              setContentMode(null)
            }}
          />
        )
      })()}
    </section>
  )
}

export default Chapters
