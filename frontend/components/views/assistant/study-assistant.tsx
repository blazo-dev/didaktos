"use client"

import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { useAssistant } from "@/hooks/common/use-assistant"
import { useCoursesStore } from "@/stores/courses-store"
import { Loader2, MessageSquare, Trash, X } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"


export function StudyAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const { askWithChoice, assistantMessages, isLoading, clearMessages } = useAssistant()
    const { currentLesson } = useCoursesStore()


    return (
        <>
            {/* Chatbot Toggle Button */}
            <div className="absolute bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-accent-secondary hover:bg-red-600 text-accent-foreground shadow-lg animate-pulse"
                >
                    <MessageSquare className="w-6 h-6" />
                </Button>
            </div>

            {/* Chatbot Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-muted/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-lg w-full max-w-2xl h-2/3 flex flex-col animate-in slide-in-from-bottom-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-border">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <span className="ml-3 font-medium text-primary">Study Assistant</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearMessages}
                                >
                                    <Trash className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {assistantMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className='flex'
                                >
                                    <div
                                        className="rounded-lg p-3 bg-muted text-foreground"
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Input */}
                        <div className="p-4 border-t border-surface-border">
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            ) : (
                                <div className="flex gap-2 flex-wrap">
                                    <Tooltip content="Generate study questions and quiz items based on the lesson content to help you test your understanding and retention">
                                        <Button
                                            className="w-full"
                                            variant={"secondary"}
                                            disabled={!currentLesson || isLoading}
                                            onClick={() => askWithChoice(currentLesson!.content, "Question")}
                                        >
                                            Create Questions
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Generate a concise summary of the key points, main concepts, and important takeaways from the lesson">
                                        <Button
                                            className="w-full"
                                            variant={"secondary"}
                                            disabled={!currentLesson || isLoading}
                                            onClick={() => askWithChoice(currentLesson!.content, "Summary")}
                                        >
                                            Create Summary
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Create a personalized study schedule with recommended time allocation and learning milestones for this lesson">
                                        <Button
                                            className="w-full"
                                            variant={"secondary"}
                                            disabled={!currentLesson || isLoading}
                                            onClick={() => askWithChoice(currentLesson!.content, "Schedule")}
                                        >
                                            Create Learning Schedule
                                        </Button>
                                    </Tooltip>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            )}
        </>
    )
}