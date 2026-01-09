import CourseList from '@/Features/Homepage/CourseList'
import Header from '@/Features/Homepage/Header'
import Hero from '@/Features/Homepage/Hero'

const page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <Hero/>
        <CourseList/>
      </main>
    </div>
  )
}

export default page