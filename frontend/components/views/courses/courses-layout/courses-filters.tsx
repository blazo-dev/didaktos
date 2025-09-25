'use client';

import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export type FilterType = 'all' | 'owned' | 'enrolled';

interface CoursesFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterType: FilterType;
    onFilterChange: (type: FilterType) => void;
    ownedCoursesCount: number;
    enrolledCoursesCount: number;
}

export function CoursesFilters({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterChange,
    ownedCoursesCount,
    enrolledCoursesCount
}: CoursesFiltersProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex bg-muted rounded-lg p-1">
                    <Button
                        variant="ghost"
                        onClick={() => onFilterChange('all')}
                        className={`${filterType === 'all' ? 'text-foreground shadow-sm' : ''}`}
                    >
                        All Courses
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => onFilterChange('owned')}
                        className={`${filterType === 'owned' ? 'text-foreground shadow-sm' : ''}`}
                    >
                        My Courses ({ownedCoursesCount})
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => onFilterChange('enrolled')}
                        className={`${filterType === 'enrolled' ? 'text-foreground shadow-sm' : ''}`}
                    >
                        Enrolled ({enrolledCoursesCount})
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>
        </div>
    );
}