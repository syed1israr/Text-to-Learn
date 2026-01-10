'use client'

import { chapterContentSlides } from '@/lib/types'
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { useState, useMemo } from 'react'

type NotesViewProps = {
  slides: chapterContentSlides[]
  onClose: () => void
  subContentTitle: string
  initialSlideIndex?: number
}

// Extract text content from HTML
const extractTextFromHTML = (html: string): string => {
  if (!html) return ''
  
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style')
  scripts.forEach(el => el.remove())
  
  // Get text content
  let text = doc.body.textContent || doc.body.innerText || ''
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
    .trim()
  
  return text
}

// Extract structured content from HTML
const extractStructuredContent = (html: string) => {
  if (!html) return { title: '', content: '', bullets: [] }
  
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style, noscript')
  scripts.forEach(el => el.remove())
  
  // Try to find title (h1, h2, h3, or elements with title-like classes)
  const titleEl = doc.querySelector('h1, h2, h3') || 
                  doc.querySelector('[class*="title"], [class*="Title"]') ||
                  doc.querySelector('[class*="heading"], [class*="Heading"]')
  const title = titleEl?.textContent?.trim() || ''
  
  // Get all paragraphs
  const paragraphs = Array.from(doc.querySelectorAll('p'))
    .map(p => {
      const text = p.textContent?.trim()
      return text && text.length > 2 ? text : null
    })
    .filter(Boolean) as string[]
  
  // Get list items (both ul/ol and data-reveal items)
  const listItems = Array.from(doc.querySelectorAll('li, [data-reveal]'))
    .map(li => {
      const text = li.textContent?.trim()
      // Filter out very short items that are likely styling artifacts
      return text && text.length > 2 ? text : null
    })
    .filter(Boolean)
    .filter((item, index, self) => self.indexOf(item) === index) as string[] // Remove duplicates
  
  // Get div content that might contain text
  const divs = Array.from(doc.querySelectorAll('div'))
    .map(div => {
      const text = div.textContent?.trim()
      // Only include divs with substantial content
      return text && text.length > 10 && !div.querySelector('p, li, h1, h2, h3') ? text : null
    })
    .filter(Boolean) as string[]
  
  // Combine all content sources
  const allContent = [...paragraphs, ...divs].filter(Boolean)
  const content = allContent.length > 0 ? allContent.join('\n\n') : ''
  
  return {
    title,
    content,
    bullets: listItems.length > 0 ? listItems : (paragraphs.length > 0 ? paragraphs : [])
  }
}

const NotesView = ({ slides, onClose, subContentTitle, initialSlideIndex = 0 }: NotesViewProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(Math.min(initialSlideIndex, Math.max(0, slides.length - 1)))
  
  const currentSlide = slides[currentSlideIndex]
  
  const slideContent = useMemo(() => {
    if (!currentSlide?.html) return { title: '', content: '', bullets: [], narration: '' }
    
    const structured = extractStructuredContent(currentSlide.html)
    const narration = currentSlide.narration?.fullText || ''
    
    return {
      title: structured.title || subContentTitle,
      content: structured.content || extractTextFromHTML(currentSlide.html),
      bullets: structured.bullets,
      narration
    }
  }, [currentSlide, subContentTitle])
  
  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }
  
  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }
  
  if (!currentSlide) return null
  
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-4xl h-full max-h-[90vh] glass-cyber geometric-border shadow-neon-lg flex flex-col'>
        {/* Corner accents */}
        <div className='absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary'></div>
        <div className='absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary'></div>
        <div className='absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary'></div>
        <div className='absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary'></div>

        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border/50'>
          <div className='space-y-1 flex-1'>
            <h3 className='font-display font-bold text-xl text-neon-cyan uppercase tracking-tight'>
              {slideContent.title}
            </h3>
            <p className='font-mono text-sm text-muted-foreground'>
              NOTE {currentSlideIndex + 1} / {slides.length}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className='geometric-border glass-cyber px-4 py-2 text-primary hover:text-destructive hover:border-destructive transition-all font-mono font-bold uppercase tracking-wider flex items-center gap-2 shrink-0'
          >
            <X className='w-4 h-4'/>
            CLOSE
          </button>
        </div>

        {/* Notes Content */}
        <div className='flex-1 overflow-y-auto p-8 space-y-6'>
          {/* Narration */}
          {slideContent.narration && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2 mb-2'>
                <BookOpen className='w-5 h-5 text-primary'/>
                <h4 className='font-mono text-sm font-bold text-primary uppercase tracking-wider'>Narration</h4>
              </div>
              <div className='glass-cyber geometric-border p-6 space-y-3'>
                <p className='font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                  {slideContent.narration}
                </p>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          {slideContent.content && (
            <div className='space-y-3'>
              <h4 className='font-mono text-sm font-bold text-primary uppercase tracking-wider'>Content</h4>
              <div className='glass-cyber geometric-border p-6 space-y-4'>
                {slideContent.bullets.length > 0 ? (
                  <ul className='space-y-3'>
                    {slideContent.bullets.map((bullet, idx) => (
                      <li key={idx} className='flex gap-3'>
                        <span className='text-primary font-mono font-bold shrink-0'>•</span>
                        <span className='font-mono text-sm text-foreground leading-relaxed flex-1'>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                    {slideContent.content}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Fallback if no content extracted */}
          {!slideContent.narration && !slideContent.content && (
            <div className='glass-cyber geometric-border p-6 text-center'>
              <p className='font-mono text-muted-foreground'>No content available for this slide</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className='flex items-center justify-between p-6 border-t border-border/50'>
          <div className='flex items-center gap-4'>
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className='geometric-border glass-cyber px-4 py-2 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow flex items-center gap-2 font-mono font-bold uppercase tracking-wider'
            >
              <ChevronLeft className='w-4 h-4'/>
              PREV
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className='geometric-border glass-cyber px-4 py-2 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-glow flex items-center gap-2 font-mono font-bold uppercase tracking-wider'
            >
              NEXT
              <ChevronRight className='w-4 h-4'/>
            </button>
          </div>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className='flex items-center gap-2'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`geometric-border w-3 h-3 transition-all ${
                    index === currentSlideIndex
                      ? 'bg-primary border-primary shadow-neon'
                      : 'bg-secondary border-border hover:border-primary/50'
                  }`}
                  aria-label={`Go to note ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className='font-mono text-xs text-muted-foreground uppercase tracking-wider'>
            {currentSlide.slideIndex || currentSlideIndex + 1}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesView
