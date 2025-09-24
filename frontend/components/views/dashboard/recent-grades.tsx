"use client"

interface Grade {
    id: string
    assignment: string
    course: string
    grade: string
    color: string
}

export function RecentGrades() {
    const grades: Grade[] = [
        {
            id: "1",
            assignment: "Midterm Exam",
            course: "CS 101",
            grade: "A-",
            color: "text-green-600"
        },
        {
            id: "2",
            assignment: "Quiz 3",
            course: "Math 201",
            grade: "A+",
            color: "text-green-600"
        },
        {
            id: "3",
            assignment: "Essay Assignment",
            course: "English Lit",
            grade: "B+",
            color: "text-blue-600"
        }
    ]

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Grades</h2>
            <div className="bg-surface border border-surface-border rounded-lg transition-all">
                {grades.map((grade, index) => {
                    const isLast = index === grades.length - 1

                    return (
                        <div
                            key={grade.id}
                            className={`p-4 border-b border-surface-border' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-primary">{grade.assignment}</p>
                                    <p className="text-muted-foreground text-sm">{grade.course}</p>
                                </div>
                                <span className={`text-lg font-bold ${grade.color}`}>
                                    {grade.grade}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}