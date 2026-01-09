import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Course } from '@/lib/types'
import { Calendar1Icon, DotIcon, LayersIcon, Play } from 'lucide-react'
import React from 'react'
import moment from "moment"
import Link from 'next/link'
const CourseListCard = ({courseItem}:{courseItem:Course}) => {
  return (
    <div>
        <Card className='bg-sidebar-primary-foreground'>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold text-lg'>
                        {courseItem.courseName}
                    </h2>
                    <h2 className='text-primary p-1 px-2 border -4xl border-primary'> { courseItem.courseLayout.level}</h2>
                </div>
                <div className='flex gap-3 items-center'>
                    <h2 className='flex items-center justify-center text-primary p-1 px-2 border -4xl border-sidebar-border'>
                        <LayersIcon className='h-4 w-4'/>
                        {courseItem.courseLayout.totalChapters} Chapters
                    </h2>
                    <h2 className='flex items-center justify-center text-primary p-1 px-2 border -4xl border-sidebar-border'>
                        <Calendar1Icon className='h-4 w-4'/>
                        {moment(courseItem.createdAt ).format("MMM DD, YYYY") }
                        <DotIcon/>
                        {moment(courseItem.createdAt ).fromNow() }
                    </h2>
                </div>
            </CardHeader>
            <CardContent>
            <div className='flex justify-between align-center'>
                <p>Keep Learning...</p>
                <Link href={`/course/${courseItem.courseId}`}><Button>Watch Now <Play/> </Button></Link>
                
            </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default CourseListCard