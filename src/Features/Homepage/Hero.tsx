'use client'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import { Loader2, Rocket, Sparkles } from 'lucide-react'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { courseGeneratorData } from '@/lib/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


const Hero = () => {
  const [input, setInput] = useState('')
  const [type, settype] = useState('full-course')
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const course_layout = async() =>{
    const toastId = toast.loading("Initializing course generation...")
    const courseId =  crypto.randomUUID();
    try {
      setloading(true);
      const res = await axios.post('/api/course-layout',{
        userInput: input,
        type,
        courseId:courseId
      });
      console.log("data",res.data)
      setloading(false);
      toast.success("Course matrix generated successfully", {id : toastId});
      router.push(`/course/${courseId}`)
    } catch (error) {
      console.log("course_layout_error",error);
      setloading(false);
      toast.error("Generation failed. Please retry.",{id:toastId})
    }
  }

  const { user } = useUser();

  return (
    <div className='relative min-h-screen flex items-center justify-center py-32 px-4 overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pulse-neon'></div>
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pulse-neon' style={{animationDelay: '1s'}}></div>
      
      {/* Diagonal accent lines */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent'></div>
        <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent'></div>
        <div className='absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent'></div>
        <div className='absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-accent to-transparent'></div>
      </div>

      <div className='relative z-10 w-full max-w-5xl'>
        {/* Header section with glitch effect */}
        <div className='text-center mb-16 space-y-6'>
          <div className='inline-block px-4 py-2 geometric-border glass-cyber mb-4'>
            <span className='font-mono text-xs text-primary tracking-widest'>AI-POWERED LEARNING</span>
          </div>
          
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-tight'>
            <span className='block text-neon-cyan glitch-text'>TEXT-TO-LEARN</span>
            <span className='block text-neon-magenta mt-2 text-3xl md:text-5xl lg:text-6xl'>AI-Powered Course Generator</span>
          </h1>
          
          <p className='text-xl md:text-2xl text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed'>
            Generate comprehensive course matrices with advanced AI algorithms
          </p>
        </div>

        {/* Main input container */}
        <div className="relative w-full glass-cyber geometric-border p-8 shadow-neon-lg">
          {/* Corner decorations */}
          <div className='absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary'></div>
          <div className='absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary'></div>
          <div className='absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary'></div>
          <div className='absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary'></div>

          <div className="relative space-y-6">
            <div className='relative'>
              <div className='absolute -left-2 top-0 bottom-0 w-1 bg-primary shadow-neon'></div>
              <InputGroupTextarea
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-32 w-full resize-none bg-input/50 px-6 py-4 text-base text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:ring-2 focus:ring-primary focus:bg-input/80 font-mono border-2 border-border focus:border-primary"
                placeholder=">> Enter course specification parameters..."
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  boxShadow: input ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none'
                }}
              />
            </div>

            {user ? (
              <div className="gap-4 flex flex-wrap items-center">
                <Select value={type} onValueChange={(val) => settype(val)}>
                  <SelectTrigger className="w-48 geometric-border bg-secondary/50 text-secondary-foreground border-border hover:border-primary transition-colors font-mono">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-neon glass-cyber">
                    <SelectItem value="full-course" className="font-mono hover:bg-primary/10">FULL_COURSE</SelectItem>
                    <SelectItem value="video" className="font-mono hover:bg-primary/10">VIDEO_SERIES</SelectItem>
                  </SelectContent>
                </Select>
                
                <button
                  onClick={course_layout} 
                  disabled={loading || !input.trim()}  
                  className="ml-auto px-8 py-3 geometric-border bg-transparent hover:bg-primary/10 text-primary hover:text-primary font-mono font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden transition-all"
                >
                  <span className='absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300'></span>
                  <span className='relative z-10 flex items-center gap-2'>
                    {loading ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin'/>
                        <span>GENERATING...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                        <span>GENERATE</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            ) : (
              <div className='flex justify-center'>
                <SignInButton mode="modal">
                  <button className='geometric-border bg-primary/10 hover:bg-primary/20 text-primary font-mono font-bold px-8 py-3 uppercase tracking-wider transition-all hover-glow'>
                    AUTHENTICATE TO CONTINUE
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

        {/* Quick prompt templates */}
        <div className='mt-16 space-y-4'>
          <div className='text-center mb-6'>
            <span className='font-mono text-sm text-muted-foreground tracking-wider'>QUICK_TEMPLATES</span>
          </div>
          <div className='flex gap-3 flex-wrap justify-center'>
            {courseGeneratorData.map((m) => (
              <button
                key={m.id}
                onClick={() => setInput(m.prompt)}
                className='group relative px-6 py-3 geometric-border glass-cyber hover:border-primary transition-all hover-glow'
              >
                <span className='absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300'></span>
                <span className='relative z-10 font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2'>
                  <Sparkles className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity'/>
                  {m.title.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero