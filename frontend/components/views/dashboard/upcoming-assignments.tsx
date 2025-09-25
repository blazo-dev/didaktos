"use client"

interface Assignment {
    id: string
    title: string
    courseTitle: string // Changed from 'course' to match your hook
    dueDate: string
}

interface UpcomingAssignmentsProps {
    assignments: Assignment[]
}

function getPriorityStyles(dueDate: string) {
    const due = new Date(dueDate)
    const now = new Date()
    const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays <= 1) {
        return {
            text: "text-red-600",
            label: "Due Tomorrow"
        }
    } else if (diffInDays <= 3) {
        return {
            text: "text-orange-600",
            label: `Due in ${diffInDays} days`
        }
    } else if (diffInDays <= 7) {
        return {
            text: "text-yellow-600",
            label: "Due This Week"
        }
    } else {
        return {
            text: "text-green-600",
            label: "Due Later"
        }
    }
}

function formatDueDate(dueDate: string) {
    const due = new Date(dueDate)
    const now = new Date()
    const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
        return due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInDays === 1) {
        return `Tomorrow ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
        return due.toLocaleDateString([], { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}

export function UpcomingAssignments({ assignments }: UpcomingAssignmentsProps) {
    // Filter assignments due within the next 7 days and sort by due date
    const upcomingAssignments = assignments
        .filter(assignment => {
            const due = new Date(assignment.dueDate)
            const now = new Date()
            const nextWeek = new Date()
            nextWeek.setDate(now.getDate() + 7)
            return due >= now && due <= nextWeek
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    if (upcomingAssignments.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Upcoming Assignments</h2>
                <div className="bg-surface border border-surface-border rounded-lg p-6">
                    <p className="text-muted-foreground text-center">No assignments due in the next week</p>
                </div>
            </section>
        )
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
                Upcoming Assignments ({upcomingAssignments.length})
            </h2>
            <div className="bg-surface border border-surface-border rounded-lg transition-all">
                {upcomingAssignments.map((assignment, index) => {
                    const priorityStyles = getPriorityStyles(assignment.dueDate)
                    const isLast = index === upcomingAssignments.length - 1

                    return (
                        <div
                            key={assignment.id}
                            className={`p-6 ${!isLast ? 'border-b border-surface-border' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-primary">{assignment.title}</h3>
                                    <p className="text-muted-foreground text-sm">{assignment.courseTitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${priorityStyles.text}`}>
                                        {priorityStyles.label}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDueDate(assignment.dueDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}