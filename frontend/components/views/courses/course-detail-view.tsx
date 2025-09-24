'use client';

import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Plus,
  Settings,
  User,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../hooks/auth/use-auth';
import { useCourse } from '../../../hooks/courses/use-course';
import Loader from '../../layout/loader';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { ModuleAccordion } from './module-accordion';

interface CourseDetailViewProps {
  courseId: string;
}

export function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(courseId);
  const [showCreateModule, setShowCreateModule] = useState(false);

  // Check if current user is the owner/creator of this course
  const isOwner = course?.instructor.id === user?.id;

  // Check if current user is enrolled as a student
  const isEnrolled = course?.students.some(student => student.id === user?.id) ?? false;

  // User can view course if they are the owner or enrolled
  const canView = isOwner || isEnrolled;

  if (isLoading) {
    return <Loader text="Loading course..." />;
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <p className="text-muted-foreground mb-4">
          The course you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push('/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don't have permission to view this course. You must be enrolled or be the course creator.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push('/courses')} variant="outline">
            Back to Courses
          </Button>
          <Button onClick={() => {/* TODO: Implement enrollment modal */ }}>
            Request Enrollment
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalAssignments = course.modules.reduce((acc, module) => acc + module.assignments.length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/courses')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex items-center gap-2 mb-4">
          {/* Course Management Actions - Only for owners */}
          {isOwner && (
            <>
              <Button
                onClick={() => setShowCreateModule(true)}
                variant="default"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
              <Button
                onClick={() => router.push(`/courses/${courseId}/settings`)}
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Course Settings
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Course Info Card */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Course Status Badges */}
          <div className="flex items-center gap-2 mb-4">
            {isOwner && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <User className="h-3 w-3 mr-1" />
                Course Owner
              </span>
            )}
            {isEnrolled && !isOwner && (
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                Enrolled Student
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : course.status === 'completed'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.students.length} enrolled
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {totalLessons} lessons
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1" />
              {totalAssignments} assignments
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Updated {new Date(course.updatedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="font-medium">Instructor</p>
              <p className="text-sm text-muted-foreground">
                {course.instructor.name}
                {isOwner && <span className="text-blue-600 ml-1">(You)</span>}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Course Modules</h2>

        {course.modules.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground mb-6">
              {isOwner
                ? 'Create your first module to start building your course content.'
                : 'This course doesn\'t have any modules yet. Check back later!'
              }
            </p>
            {isOwner && (
              <Button onClick={() => setShowCreateModule(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            )}
          </Card>
        ) : (
          <ModuleAccordion
            modules={course.modules}
            courseId={course.id}
            canEdit={isOwner}
            isEnrolled={isEnrolled}
          />
        )}
      </div>

      {/* TODO: Add Create Module Modal */}
      {/* 
      {showCreateModule && (
        <CreateModuleModal
          courseId={courseId}
          isOpen={showCreateModule}
          onClose={() => setShowCreateModule(false)}
        />
      )}
      */}
    </div>
  );
}