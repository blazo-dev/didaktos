import { lessonsApi } from "@/lib/api/lesson";
import { useCoursesStore } from "@/stores/courses-store";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Lesson } from "@/types/course";

export const useUpdateLesson = () => {
  const { setCurrentLesson } = useCoursesStore();

  return useApiMutation(
    ({ id, lessonData }: {
      id: string;
      lessonData: Partial<Lesson>;
    }) => lessonsApi.updateLesson(id, lessonData),
    {
      successMessage: "Lesson updated successfully!",
      errorMessage: "Failed to update lesson. Please try again.",
      invalidateKeys: ["courses"],
      onSuccess: (lesson) => {
        setCurrentLesson(lesson);
      },
    }
  );
};
