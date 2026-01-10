import { Button } from '@/components/ui/button'
import { Course } from '@/lib/types'
import { Calendar, Clock, Layers3, Play, Terminal } from 'lucide-react'
import React from 'react'
import moment from "moment"
import Link from 'next/link'

const CourseListCard = ({courseItem}:{courseItem:Course}) => {
  return (
    <Link href={`/course/${courseItem.courseId}`} className="block group">
      <div className='h-full border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all overflow-hidden bg-card'>
        <div className='p-5 space-y-4 h-full flex flex-col'>
          {/* Header */}
          <div className='flex-1 space-y-3'>
            <div className='flex justify-between items-start gap-3'>
              <h3 className='text-lg font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors'>
                {courseItem.courseName}
              </h3>
              <span className='px-2 py-1 text-xs bg-muted text-muted-foreground rounded shrink-0'>
                {courseItem.courseLayout.level}
              </span>
            </div>

            {/* Metadata */}
            <div className='flex gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1.5'>
                <Layers3 className='w-4 h-4'/>
                <span>{courseItem.courseLayout.totalChapters} modules</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <Calendar className='w-4 h-4'/>
                <span>{moment(courseItem.createdAt).format("MMM DD")}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='pt-3 border-t border-border flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Ready</span>
            <div className='flex items-center gap-1.5 text-sm text-primary group-hover:gap-2 transition-all'>
              <span>View</span>
              <Play className='w-3.5 h-3.5'/>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseListCard