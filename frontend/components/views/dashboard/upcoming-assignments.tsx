"use client"

interface Assignment {
    id: string
    title: string
    course: string
    dueDate: string
    priority: "high" | "medium" | "low"
}

function getPriorityStyles(priority: string) {
    switch (priority) {
        case "high":
            return {
                text: "text-red-600",
                label: "Due Tomorrow"
            }
        case "medium":
            return {
                text: "text-orange-600",
                label: "Due Friday"
            }
        case "low":
            return {
                text: "text-green-600",
                label: "Due Next Week"
            }
        default:
            return {
                text: "text-secondary",
                label: "Due Later"
            }
    }
}

export function UpcomingAssignments() {
    const assignments: Assignment[] = [
        {
            id: "1",
            title: "Data Structures Project",
            course: "Computer Science 101",
            dueDate: "11:59 PM",
            priority: "high"
        },
        {
            id: "2",
            title: "Calculus Problem Set 5",
            course: "Mathematics 201",
            dueDate: "11:59 PM",
            priority: "medium"
        },
        {
            id: "3",
            title: "Research Paper Draft",
            course: "English Literature",
            dueDate: "Monday 11:59 PM",
            priority: "low"
        }
    ]

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Upcoming Assignments</h2>
            <div className="bg-surface border border-surface-border rounded-lg transition-all">
                {assignments.map((assignment, index) => {
                    const priorityStyles = getPriorityStyles(assignment.priority)
                    const isLast = index === assignments.length - 1

                    return (
                        <div
                            key={assignment.id}
                            className={`p-6 ${!isLast ? 'border-b border-surface-border' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-primary">{assignment.title}</h3>
                                    <p className="text-muted-foreground text-sm">{assignment.course}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${priorityStyles.text}`}>
                                        {priorityStyles.label}
                                    </p>
                                    <p className="text-muted-foreground text-xs">{assignment.dueDate}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}