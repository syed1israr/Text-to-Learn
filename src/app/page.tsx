import CourseList from '@/Features/Homepage/CourseList'
import Header from '@/Features/Homepage/Header'
import Hero from '@/Features/Homepage/Hero'

const page = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex-1 pt-20">
        <Hero/>
        <CourseList/>
      </main>
      
      {/* Global scan line effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="scan-line absolute inset-0"></div>
      </div>
      
      {/* Corner accent decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/20 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/20 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/20 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/20 pointer-events-none"></div>
    </div>
  )
}

export default page