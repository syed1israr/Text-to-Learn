'use client'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Loader2, Rocket } from 'lucide-react'
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
      setloading(false);
      toast.success("Course matrix generated successfully", {id : toastId});
      router.push(`/course/${courseId}`)
    } catch (error) {
      setloading(false);
      toast.error("Generation failed. Please retry.",{id:toastId})
    }
  }

  const { user } = useUser();

  return (
    <div className='min-h-screen flex items-center justify-center py-24 px-4'>
      <div className='w-full max-w-3xl space-y-12'>
        {/* Header section */}
        <div className='text-center space-y-4'>
          <h1 className='text-5xl md:text-6xl font-semibold text-foreground leading-tight'>
            Text-to-Learn
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            AI-Powered Course Generator
          </p>
          <p className='text-base text-muted-foreground max-w-xl mx-auto'>
            Transform your ideas into comprehensive, structured courses with AI-powered insights
          </p>
        </div>

        {/* Main input container */}
        <div className="w-full space-y-4">
          <InputGroupTextarea
            data-slot="input-group-control"
            className="flex field-sizing-content min-h-32 w-full resize-none bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-primary/20 border border-border rounded-md focus:border-primary"
            placeholder="Describe your course idea..."
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
          />

          {user ? (
            <div className="flex gap-3 items-center">
              <Select value={type} onValueChange={(val) => settype(val)}>
                <SelectTrigger className="w-40 bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="full-course">Full Course</SelectItem>
                  <SelectItem value="video">Video Series</SelectItem>
                </SelectContent>
              </Select>
              
              <button
                onClick={course_layout} 
                disabled={loading || !input.trim()}  
                className="ml-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin'/>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Rocket className='w-4 h-4'/>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className='flex justify-center'>
              <SignInButton mode="modal">
                <Button className="px-6 py-2.5">
                  Get Started
                </Button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Quick prompt templates */}
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground text-center'>Quick templates</p>
          <div className='flex gap-2 flex-wrap justify-center'>
            {courseGeneratorData.map((m) => (
              <button
                key={m.id}
                onClick={() => setInput(m.prompt)}
                className='px-4 py-2 text-sm text-foreground hover:bg-muted border border-border rounded-md transition-colors'
              >
                {m.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero