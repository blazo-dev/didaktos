"use client"

import { Button } from "@/components/ui/button"
import { useAssistant } from "@/hooks/common/use-assistant"
import { useCoursesStore } from "@/stores/courses-store"
import { MessageSquare, Send, X } from "lucide-react"
import { useState } from "react"


interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
}

export function StudyAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const {askWithChoice,messages} = useAssistant()
    const {currentLesson} = useCoursesStore()


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
                    <div className="bg-surface rounded-lg w-full max-w-md h-96 flex flex-col animate-in slide-in-from-bottom-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-border">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <span className="ml-3 font-medium text-primary">Study Assistant</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role == "user" ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`rounded-lg p-3 max-w-xs ${msg.role == "user"
                                            ? 'bg-primary text-surface'
                                            : 'bg-muted text-primary'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-surface-border">
                            <div className="flex space-x-2">
                                <Button onClick={() => askWithChoice(currentLesson!.content,"Question")} className="bg-accent-secondary hover:bg-red-600">
                                    Create Questions for lesson
                                </Button>
                                <Button onClick={() => askWithChoice(currentLesson!.content,"Summary")} className="bg-accent-secondary hover:bg-red-600">
                                    Create Summary for lesson
                                </Button>
                                <Button onClick={() => askWithChoice(currentLesson!.content,"Schedule")} className="bg-accent-secondary hover:bg-red-600">
                                    Create learning Schedule for lesson
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}