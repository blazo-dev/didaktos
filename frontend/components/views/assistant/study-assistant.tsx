"use client"

import { Button } from "@/components/ui/button"
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
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I'm your study assistant. I can help you plan your study schedule, understand assignments, and stay organized. What would you like help with?",
            isUser: false,
            timestamp: new Date()
        }
    ])

    const sendMessage = () => {
        if (!message.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            isUser: true,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newMessage])
        setMessage("")

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "I can help you create a study schedule for your upcoming assignments!",
                "Would you like me to break down your Data Structures project into manageable tasks?",
                "I notice you have 3 assignments due this week. Let's prioritize them!",
                "Great question! Let me help you understand that concept better.",
                "I can help you prepare for your upcoming exams. What subject would you like to focus on?"
            ]

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responses[Math.floor(Math.random() * responses.length)],
                isUser: false,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botResponse])
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

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
                                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`rounded-lg p-3 max-w-xs ${msg.isUser
                                            ? 'bg-primary text-surface'
                                            : 'bg-muted text-primary'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-surface-border">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-3 py-2 border border-surface-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                                />
                                <Button onClick={sendMessage} className="bg-accent-secondary hover:bg-red-600">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}