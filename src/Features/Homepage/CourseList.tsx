import React from 'react'

const CourseList = () => {
  return (
    <section className="w-full py-20 px-4 md:px-6 bg-linear-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Courses</h3>
          <p className="text-lg text-muted-foreground">Manage and track all your generated courses in one place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">No courses generated yet. Start by creating your first course above.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseList