"use client"

import { Button } from "@/components/ui/button"

interface Course {
    id: string
    title: string
    instructor: string
    progress: number
}

export function CurrentCourses({ courses }: { courses : Course[] }) {

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Current Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-surface border border-surface-border rounded-lg p-6 transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-lg text-primary">{course.title}</h3>
                                <p className="text-muted-foreground text-sm">{course.instructor}</p>
                            </div>
                            <span className="bg-primary text-surface px-2 py-1 rounded text-xs">
                                Active
                            </span>
                        </div>
                        <Button variant="secondary" >
                            View Course
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    )
}