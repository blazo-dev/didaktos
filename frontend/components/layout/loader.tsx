import React from 'react'

type LoaderProps = {
    text: string;
}

function Loader({ text }: LoaderProps) {
    return (
        <div id="loading-overlay" className="fixed inset-0 flex bg-muted/80 z-40 items-center justify-center">
            <div className="text-center space-y-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground font-semibold uppercase">{text}</p>
            </div>
        </div>
    )
}

export default Loader