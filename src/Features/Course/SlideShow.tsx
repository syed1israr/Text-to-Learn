'use client'

import { chapterContentSlides } from '@/lib/types'
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

type SlideShowProps = {
  slides: chapterContentSlides[]
  onClose: () => void
  subContentTitle: string
  initialSlideIndex?: number
}

const SlideShow = ({ slides, onClose, subContentTitle, initialSlideIndex = 0 }: SlideShowProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(Math.min(initialSlideIndex, Math.max(0, slides.length - 1)))
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({})
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({})
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentSlide = slides[currentSlideIndex]

  // Reset slide when index changes
  useEffect(() => {
    const iframe = iframeRefs.current[currentSlideIndex]
    const audio = audioRefs.current[currentSlideIndex]
    
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'RESET' }, '*')
    }
    
    if (audio) {
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }, [currentSlideIndex])

  // Handle reveal animations for current slide based on audio progress
  useEffect(() => {
    if (!currentSlide) return

    const iframe = iframeRefs.current[currentSlideIndex]
    const audio = audioRefs.current[currentSlideIndex]
    
    if (!iframe?.contentWindow || !audio) return

    const handleTimeUpdate = () => {
      if (!audio || !iframe?.contentWindow) return
      
      const currentTime = audio.currentTime
      const revelData = currentSlide.revelData || []
      
      if (revelData.length === 0 || audio.duration === 0) return
      
      // Simple reveal timing: reveal items progressively based on audio progress
      // Each reveal happens at evenly spaced intervals throughout the audio duration
      revelData.forEach((revealId, index) => {
        const revealTime = ((index + 1) / (revelData.length + 1)) * audio.duration
        if (currentTime >= revealTime) {
          iframe.contentWindow.postMessage({ type: 'REVEAL', id: revealId }, '*')
        }
      })
    }

    // Reset reveals when audio loads or slide changes
    const handleLoadedMetadata = () => {
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'RESET' }, '*')
      }
    }
    
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    // Check immediately if audio is already loaded
    if (audio.readyState >= 2) {
      handleLoadedMetadata()
      handleTimeUpdate()
    }
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentSlide, currentSlideIndex])


  const injectRevealRuntime = (html: string) => {
    const REVEAL_RUNTIME_SCRIPT = `
      <script>
      (function () {
        function reset() {
          document.querySelectorAll(".reveal").forEach(el =>
            el.classList.remove("is-on")
          );
        }
        function reveal(id) {
          var el = document.querySelector("[data-reveal='" + id + "']");
          if (el) el.classList.add("is-on");
        }
        window.addEventListener("message", function (e) {
          var msg = e.data;
          if (!msg) return;
          if (msg.type === "RESET") reset();
          if (msg.type === "REVEAL") reveal(msg.id);
        });
      })();
      </script>
    `
    
    if (html.includes("</body>")) {
      return html.replace("</body>", `${REVEAL_RUNTIME_SCRIPT}</body>`)
    }
    return html + REVEAL_RUNTIME_SCRIPT
  }

  const goToSlide = (index: number) => {
    // Stop current audio
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    setCurrentSlideIndex(index)
    setIsPlaying(false)
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }
  }

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRefs.current[currentSlideIndex]
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
    // Auto advance to next slide after delay
    if (currentSlideIndex < slides.length - 1) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        nextSlide()
        setIsPlaying(true)
        const nextAudio = audioRefs.current[currentSlideIndex + 1]
        if (nextAudio) {
          nextAudio.play()
        }
      }, 1000)
    }
  }

  if (!currentSlide) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-7xl h-full max-h-[90vh] glass-cyber geometric-border shadow-neon-lg flex flex-col'>
        {/* Corner accents */}
        <div className='absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary'></div>
        <div className='absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary'></div>
        <div className='absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary'></div>
        <div className='absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary'></div>

        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border/50'>
          <div className='space-y-1'>
            <h3 className='font-display font-bold text-xl text-neon-cyan uppercase tracking-tight'>
              {subContentTitle}
            </h3>
            <p className='font-mono text-sm text-muted-foreground'>
              SLIDE {currentSlideIndex + 1} / {slides.length}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className='geometric-border glass-cyber px-4 py-2 text-primary hover:text-destructive hover:border-destructive transition-all font-mono font-bold uppercase tracking-wider flex items-center gap-2'
          >
            <X className='w-4 h-4'/>
            CLOSE
          </button>
        </div>

        {/* Slide content */}
        <div className='flex-1 relative overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center p-8'>
            <div className='relative w-full h-full max-w-6xl max-h-full glass-cyber geometric-border overflow-hidden'>
              <iframe
                ref={(el) => {
                  iframeRefs.current[currentSlideIndex] = el
                }}
                srcDoc={injectRevealRuntime(currentSlide.html)}
                className='w-full h-full border-none'
                sandbox='allow-scripts allow-same-origin'
                style={{ aspectRatio: '16/9' }}
                onLoad={() => {
                  const iframe = iframeRefs.current[currentSlideIndex]
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'RESET' }, '*')
                  }
                  // Trigger reveal update after iframe loads
                  setTimeout(() => {
                    const audio = audioRefs.current[currentSlideIndex]
                    if (audio && audio.readyState >= 2) {
                      const event = new Event('timeupdate')
                      audio.dispatchEvent(event)
                    }
                  }, 100)
                }}
              />
              <audio
                ref={(el) => {
                  audioRefs.current[currentSlideIndex] = el
                }}
                src={currentSlide.audioFileUrl}
                onEnded={handleAudioEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                  const iframe = iframeRefs.current[currentSlideIndex]
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'RESET' }, '*')
                  }
                }}
                className='hidden'
              />
            </div>
          </div>

          {/* Navigation buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className='absolute left-4 top-1/2 -translate-y-1/2 geometric-border glass-cyber w-12 h-12 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow'
              >
                <ChevronLeft className='w-6 h-6'/>
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                className='absolute right-4 top-1/2 -translate-y-1/2 geometric-border glass-cyber w-12 h-12 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow'
              >
                <ChevronRight className='w-6 h-6'/>
              </button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className='flex items-center justify-between p-6 border-t border-border/50'>
          <div className='flex items-center gap-4'>
            <button
              onClick={togglePlayPause}
              className='geometric-border glass-cyber px-6 py-3 text-primary hover:bg-primary/20 font-mono font-bold uppercase tracking-wider transition-all hover-glow flex items-center gap-2'
            >
              {isPlaying ? <Pause className='w-4 h-4'/> : <Play className='w-4 h-4'/>}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
          </div>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className='flex items-center gap-2'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`geometric-border w-3 h-3 transition-all ${
                    index === currentSlideIndex
                      ? 'bg-primary border-primary shadow-neon'
                      : 'bg-secondary border-border hover:border-primary/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className='font-mono text-xs text-muted-foreground uppercase tracking-wider'>
            {currentSlide.narration.fullText.substring(0, 100)}...
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideShow
