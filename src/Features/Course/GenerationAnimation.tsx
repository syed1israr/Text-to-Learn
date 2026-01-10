'use client'

import { Code2, FileText, Sparkles } from 'lucide-react'

type GenerationAnimationProps = {
  currentChapter: number
  totalChapters: number
  message?: string
}

const GenerationAnimation = ({ currentChapter, totalChapters, message }: GenerationAnimationProps) => {
  const progress = totalChapters > 0 ? (currentChapter / totalChapters) * 100 : 0
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative z-10 text-center space-y-6 max-w-md mx-auto px-4">

        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-spin" style={{animationDuration: '3s'}} />
          </div>
        </div>

        
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">
            Generating Content
          </div>
          <div className="text-2xl font-semibold text-foreground">
            Chapter {currentChapter} of {totalChapters}
          </div>
          {message && (
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              {message}
            </div>
          )}
        </div>

        
        <div className="w-full max-w-md mx-auto space-y-2">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 rounded-full"
              style={{width: `${progress}%`}}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>

        
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex flex-col items-center gap-2">
            <Code2 className="w-6 h-6 text-muted-foreground animate-pulse" />
            <span className="text-xs text-muted-foreground">Processing</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-6 h-6 text-muted-foreground animate-pulse" style={{animationDelay: '0.3s'}} />
            <span className="text-xs text-muted-foreground">Creating</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-muted-foreground animate-pulse" style={{animationDelay: '0.6s'}} />
            <span className="text-xs text-muted-foreground">Generating</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerationAnimation
