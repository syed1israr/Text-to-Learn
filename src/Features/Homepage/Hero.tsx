'use client'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group'
import { Send } from 'lucide-react'
import React from 'react'
import TextareaAutosize from "react-textarea-autosize"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courseGeneratorData } from '@/lib/constant'


const Hero = () => {
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
        />
        <InputGroupAddon align="block-end" className="gap-2 mt-4 flex">
          <Select>
            <SelectTrigger className="w-40 bg-secondary text-secondary-foreground border-border">
              <SelectValue placeholder="Full Course" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="full-course">Full Course</SelectItem>
              <SelectItem value="video">Video Series</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
            </SelectContent>
          </Select>
          <InputGroupButton className="ml-auto px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium" size="sm" variant="default">
            <Send className='w-5 h-5'/>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      </div>

      <div className='flex gap-4 mt-12 max-w-4xl flex-wrap justify-center'>
        {courseGeneratorData.map((m,idx) => (
          <div key={m.id} className='hover-lift'>
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