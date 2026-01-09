'use client'

import { Sparkles, Zap, Code2, FileText } from 'lucide-react'

type GenerationAnimationProps = {
  currentChapter: number
  totalChapters: number
  message?: string
}

const GenerationAnimation = ({ currentChapter, totalChapters, message }: GenerationAnimationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>
      
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-4">
        {/* Animated icon */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute inset-0 geometric-border border-primary glass-cyber flex items-center justify-center rounded-full">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-primary animate-spin" style={{animationDuration: '3s'}} />
              <Zap className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-4">
          <div className="font-mono text-sm text-primary tracking-widest uppercase">
            Generating Content
          </div>
          <div className="font-display text-4xl font-black text-neon-cyan">
            Chapter {currentChapter} / {totalChapters}
          </div>
          {message && (
            <div className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
              {message}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto space-y-2">
          <div className="relative h-2 bg-secondary overflow-hidden geometric-border">
            <div 
              className="absolute top-0 left-0 h-full bg-primary shadow-neon transition-all duration-500"
              style={{width: `${(currentChapter / totalChapters) * 100}%`}}
            >
              <div className="absolute inset-0 scan-line"></div>
            </div>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {Math.round((currentChapter / totalChapters) * 100)}% Complete
          </div>
        </div>

        {/* Animated elements */}
        <div className="flex items-center justify-center gap-8 pt-8">
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}>
            <Code2 className="w-8 h-8 text-primary/70" />
            <span className="font-mono text-xs text-muted-foreground">Processing</span>
          </div>
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
            <FileText className="w-8 h-8 text-primary/70" />
            <span className="font-mono text-xs text-muted-foreground">Creating</span>
          </div>
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0.6s', animationDuration: '2s'}}>
            <Sparkles className="w-8 h-8 text-primary/70" />
            <span className="font-mono text-xs text-muted-foreground">Generating</span>
          </div>
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
    </div>
  )
}

export default GenerationAnimation
