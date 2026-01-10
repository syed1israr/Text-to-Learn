import { Course } from '@/lib/types'
import { Player } from '@remotion/player'
import { Award, BookOpen, ChartBar, Loader2Icon, Play, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CourseComposition } from './ChapterVideo'

const CourseInfoCard = ({course,durationBySlide} : {course:Course | undefined,durationBySlide:Record<string,number>|null} ) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const fps = 30;
  const slides = course?.chapterContentSlides??[];

 

  const durationInFrames = useMemo(() => {
    if (!durationBySlide) return 0;
    const GAP_FRAMES = Math.round(1 * fps);
    return slides.reduce((sum, slide, idx) => {
      const dur = durationBySlide[slide.slideId] ?? fps * 6;
      const gap = idx === slides.length - 1 ? 0 : GAP_FRAMES;
      return sum + dur + gap;
    }, 0);
  }, [durationBySlide, slides, fps]);

  

  if( !durationBySlide ){
    return (
      <div className='w-full min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <Loader2Icon className='w-12 h-12 text-primary animate-spin mx-auto'/>
          <p className='font-mono text-muted-foreground'>Loading course data...</p>
        </div>
      </div>
    )
  }

  return (
    <section className='relative w-full min-h-screen flex items-center overflow-hidden py-20 px-4 md:px-8'>
      {/* Animated background elements */}
      <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pulse-neon'></div>
      <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pulse-neon' style={{animationDelay: '1s'}}></div>
      
      {/* Grid overlay */}
      <div className='absolute inset-0 bg-cyber-grid opacity-30'></div>
      
      {/* Diagonal accent lines */}
      <div className='absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary to-transparent'></div>
      <div className='absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent'></div>
      
      <div className='relative z-10 max-w-7xl mx-auto w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          
          {/* Left Side - Content */}
          <div className='space-y-8'>
            {/* Badge */}
            <div className='inline-block geometric-border glass-cyber px-4 py-2'>
              <span className='font-mono text-xs text-primary tracking-widest uppercase flex items-center gap-2'>
                <Zap className='w-3 h-3'/>
                Course Module
              </span>
            </div>
            
            {/* Title */}
            <h1 className='font-display font-black text-5xl md:text-7xl leading-tight text-neon-cyan uppercase tracking-tight glitch-text'>
              {course?.courseName}
            </h1>
            
            {/* Description */}
            <p className='text-lg text-muted-foreground font-mono leading-relaxed max-w-xl'>
              {course?.courseLayout.courseDescription}
            </p>
            
            {/* Stats Grid */}
            <div className='grid grid-cols-3 gap-4 pt-4'>
              <div className='group relative glass-cyber geometric-border p-4 hover-glow cursor-pointer'>
                <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors'></div>
                <div className='relative'>
                  <div className='w-10 h-10 geometric-border glass-cyber flex items-center justify-center mb-3 group-hover:border-primary transition-colors'>
                    <ChartBar className='w-5 h-5 text-primary'/>
                  </div>
                  <p className='font-mono text-xs text-muted-foreground/70 mb-1'>LEVEL</p>
                  <p className='font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors'>
                    {course?.courseLayout.level.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className='group relative glass-cyber geometric-border p-4 hover-glow cursor-pointer'>
                <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors'></div>
                <div className='relative'>
                  <div className='w-10 h-10 geometric-border glass-cyber flex items-center justify-center mb-3 group-hover:border-primary transition-colors'>
                    <BookOpen className='w-5 h-5 text-primary'/>
                  </div>
                  <p className='font-mono text-xs text-muted-foreground/70 mb-1'>MODULES</p>
                  <p className='font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors'>
                    {course?.courseLayout?.totalChapters}
                  </p>
                </div>
              </div>

              <div className='group relative glass-cyber geometric-border p-4 hover-glow cursor-pointer'>
                <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors'></div>
                <div className='relative'>
                  <div className='w-10 h-10 geometric-border glass-cyber flex items-center justify-center mb-3 group-hover:border-primary transition-colors'>
                    <Award className='w-5 h-5 text-primary'/>
                  </div>
                  <p className='font-mono text-xs text-muted-foreground/70 mb-1'>RATING</p>
                  <p className='font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors'>
                    4.9
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setIsVideoOpen(!isVideoOpen)} 
              className='group relative w-full geometric-border glass-cyber hover:border-primary px-8 py-4 font-mono font-bold text-primary hover:text-primary uppercase tracking-wider transition-all hover-glow overflow-hidden'
            >
              <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors'></div>
              <span className='relative z-10 flex items-center justify-center gap-3'>
                {isVideoOpen ? (
                  <>
                    <Zap className='w-5 h-5'/>
                    <span>HIDE PREVIEW</span>
                  </>
                ) : (
                  <>
                    <Play className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                    <span>INITIALIZE MODULE</span>
                  </>
                )}
              </span>
            </button>
          </div>
          
          {/* Right Side - Visual Showcase */}
          <div className='relative h-125 hidden lg:flex items-center justify-center'>
            <div className='absolute inset-0 geometric-border glass-cyber shadow-neon-lg'></div>
            <div className='absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary'></div>
            <div className='absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary'></div>
            <div className='absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary'></div>
            <div className='absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary'></div>
            
            {isVideoOpen ? (
              <div className='relative w-full h-full p-4'>
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
                  }}
                />
              </div>
            ) : (
              <div className='relative text-center space-y-6 p-8'>
                <div className='relative inline-block'>
                  <div className='absolute inset-0 bg-primary/20 blur-2xl'></div>
                  <div className='relative w-32 h-32 geometric-border glass-cyber flex items-center justify-center shadow-neon'>
                    <BookOpen className='w-16 h-16 text-primary'/>
                  </div>
                </div>
                <div className='space-y-2'>
                  <p className='font-display font-bold text-xl text-neon-cyan'>INTERACTIVE MODULE</p>
                  <p className='font-mono text-sm text-muted-foreground max-w-xs mx-auto'>Engage with dynamic content and video matrices</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseInfoCard