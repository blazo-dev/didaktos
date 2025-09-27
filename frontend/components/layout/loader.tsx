
'use client';

import { LoadingState } from '../ui/loading-states';

interface LoaderProps {
    text: string;
}

function Loader({ text }: LoaderProps) {
    return (
        <div id="loading-overlay" className="fixed inset-0 flex bg-muted z-40 items-center justify-center">
            <div className="text-center space-y-6">
                <LoadingState text={text} size="lg" className="text-muted-foreground font-semibold uppercase" />
            </div>
        </div>
    );
}

export default Loader;