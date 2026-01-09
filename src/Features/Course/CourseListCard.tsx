import { Button } from '@/components/ui/button'
import { Course } from '@/lib/types'
import { Calendar, Clock, Layers3, Play, Terminal } from 'lucide-react'
import React from 'react'
import moment from "moment"
import Link from 'next/link'

const CourseListCard = ({courseItem}:{courseItem:Course}) => {
  return (
    <Link href={`/course/${courseItem.courseId}`} className="block group">
      <div className='relative h-full glass-cyber geometric-border hover-glow transition-all duration-300 overflow-hidden'>
        {/* Animated border glow */}
        <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300'></div>
        
        {/* Corner accent marks */}
        <div className='absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors'></div>
        <div className='absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors'></div>
        <div className='absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors'></div>
        <div className='absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors'></div>
        
        {/* Scan line effect */}
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='scan-line absolute inset-0'></div>
        </div>

        <div className='relative p-6 space-y-4 h-full flex flex-col'>
          {/* Header */}
          <div className='flex-1 space-y-4'>
            <div className='flex justify-between items-start gap-3'>
              <h3 className='font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1'>
                {courseItem.courseName}
              </h3>
              <div className='geometric-border glass-cyber px-3 py-1 shrink-0'>
                <span className='font-mono text-xs font-bold text-primary'>
                  {courseItem.courseLayout.level.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metadata grid */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors'>
                <div className='w-8 h-8 geometric-border glass-cyber flex items-center justify-center'>
                  <Layers3 className='w-4 h-4'/>
                </div>
                <div>
                  <p className='font-mono text-xs text-muted-foreground/70'>MODULES</p>
                  <p className='font-mono text-sm font-bold'>{courseItem.courseLayout.totalChapters}</p>
                </div>
              </div>
              
              <div className='flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors'>
                <div className='w-8 h-8 geometric-border glass-cyber flex items-center justify-center'>
                  <Calendar className='w-4 h-4'/>
                </div>
                <div>
                  <p className='font-mono text-xs text-muted-foreground/70'>CREATED</p>
                  <p className='font-mono text-sm font-bold'>{moment(courseItem.createdAt).format("MMM DD")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='pt-4 border-t border-border/50'>
            <div className='flex items-center justify-between'>
              <span className='font-mono text-xs text-muted-foreground/70 flex items-center gap-2'>
                <Terminal className='w-3 h-3'/>
                READY
              </span>
              <div className='geometric-border bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:shadow-neon transition-all'>
                <span>LOAD</span>
                <Play className='w-3 h-3 group-hover:translate-x-1 transition-transform'/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseListCard