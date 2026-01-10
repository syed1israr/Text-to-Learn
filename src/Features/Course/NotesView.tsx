'use client'

import { chapterContentSlides } from '@/lib/types'
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'

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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-3xl h-full max-h-[90vh] bg-card border border-border rounded-lg shadow-lg flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-border'>
          <div className='space-y-1 flex-1'>
            <h3 className='text-lg font-semibold text-foreground'>
              {slideContent.title}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Note {currentSlideIndex + 1} of {slides.length}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className='p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors'
          >
            <X className='w-5 h-5'/>
          </button>
        </div>

        {/* Notes Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6'>

           {/* Main Content */}
           {slideContent.content && (
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-foreground'>Content</h4>
              <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
                {slideContent.bullets.length > 0 ? (
                  <ul className='space-y-2'>
                    {slideContent.bullets.map((bullet, idx) => (
                      <li key={idx} className='flex gap-3'>
                        <span className='text-primary shrink-0'>•</span>
                        <span className='text-sm text-foreground leading-relaxed flex-1'>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                    {slideContent.content}
                  </p>
                )}
              </div>
            </div>
          )}


          {/* Explaination */}
          {slideContent.narration && (
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <BookOpen className='w-4 h-4 text-muted-foreground'/>
                <h4 className='text-sm font-medium text-foreground'>Explaination</h4>
              </div>
              <div className='bg-muted/50 rounded-lg p-4'>
                <p className='text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                  {slideContent.narration}
                </p>
              </div>
            </div>
          )}
          
         
          
          {/* Fallback if no content extracted */}
          {!slideContent.narration && !slideContent.content && (
            <div className='bg-muted/50 rounded-lg p-6 text-center'>
              <p className='text-sm text-muted-foreground'>No content available for this slide</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className='flex items-center justify-between p-5 border-t border-border'>
          <div className='flex items-center gap-2'>
            <button
              onClick={prevSlide}
                disabled={currentSlideIndex === 0}
              className='px-3 py-2 text-sm text-foreground hover:bg-muted border border-border rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4'/>
              Previous
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className='px-3 py-2 text-sm text-foreground hover:bg-muted border border-border rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2'
            >
              Next
              <ChevronRight className='w-4 h-4'/>
            </button>
          </div>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className='flex items-center gap-1.5'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlideIndex
                      ? 'bg-primary'
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to note ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesView
