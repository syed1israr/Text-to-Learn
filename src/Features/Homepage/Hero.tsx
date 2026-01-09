'use client'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group'
import { Loader2, Send } from 'lucide-react'
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
    const toastId = toast.loading("Generating Course")
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
      toast.success("Course Generated Successfully", {id : toastId});
      router.push(`/course/${courseId}`)
    } catch (error) {
      console.log("course_layout_error",error);
      setloading(false);
      toast.error("something Went Wrong",{id:toastId})
    }
  }

  const { user } = useUser();

  return (
    <div className='flex items-center flex-col justify-center min-h-screen py-20 px-4'>
        <div className='text-center mb-12 max-w-2xl'>
            <h2 className='text-5xl font-bold mb-4 text-foreground'>
              <span className='bg-primary-gradient bg-clip-text text-transparent'>AI</span> Courses Generator
            </h2>
            <p className='text-lg text-muted-foreground'>Create comprehensive, structured courses with AI-powered insights and detailed curriculum planning</p>
        </div>
        <div className="w-full max-w-xl gap-6 mt-8 rounded-2xl p-6 bg-card border border-border shadow-educational">
       <InputGroup>
        <InputGroupTextarea
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-24 w-full resize-none rounded-lg bg-input px-4 py-3 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none focus:ring-2 focus:ring-primary md:text-sm border border-border"
          placeholder="Describe your course idea..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
        />
      {user ?  <InputGroupAddon align="block-end" className="gap-2 mt-4 flex">
          <Select value={type} onValueChange={(val) => settype(val)}>
            <SelectTrigger className="w-40 bg-secondary text-secondary-foreground border-border">
              <SelectValue placeholder="Full Course" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="full-course">Full Course</SelectItem>
              <SelectItem value="video">Video Series</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
            </SelectContent>
          </Select>
          <InputGroupButton onClick={course_layout} disabled={loading}  className="ml-auto px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium" size="sm" variant="default">
           { loading ? <Loader2 className='animate-spin'/> :<Send className='w-5 h-5'/> } 
          </InputGroupButton>
        </InputGroupAddon> : <SignInButton/>}
      </InputGroup>
      </div>

      <div className='flex gap-4 mt-12 max-w-4xl flex-wrap justify-center'>
        {courseGeneratorData.map((m) => (
          <div key={m.id} className='hover-lift' onClick={() => setInput(m.prompt)}>
            <button className='border border-primary/30 rounded-xl px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200'>
              {m.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero