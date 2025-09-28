# Migration Plan: Eliminating Global "Current Entity" State Pattern

## Problem Analysis

The `stores/app-store.ts` currently maintains global state for "current" entities:

- `currentCourse`, `setCurrentCourse`
- `currentModule`, `setCurrentModule`
- `currentLesson`, `setCurrentLesson`
- `currentAssignment`, `setCurrentAssignment`
- `currentSubmission`, `setCurrentSubmission`
- `currentSubmissions`, `setCurrentSubmissions`

This pattern creates tight coupling between components and causes issues:

1. **State Synchronization**: Global state can become stale or inconsistent with URL
2. **Component Coupling**: Components depend on global state instead of props/URL
3. **Testing Complexity**: Global state makes components harder to test in isolation
4. **SSR Issues**: Global state doesn't hydrate properly with Next.js SSR

## Solution: URL-Based Entity State

Replace global "current entity" state with URL parameter-based entity resolution using Next.js dynamic routing.

### Architecture Changes

**BEFORE (Global State Pattern):**

```typescript
// Component sets global state
setCurrentCourse(course);
router.push(`/courses/${course.id}`);

// Other components read from global state
const { currentCourse } = useAppStore();
```

**AFTER (URL-Based Pattern):**

```typescript
// Component navigates directly
router.push(`/courses/${course.id}`);

// Components derive entities from URL
const { course, courseId } = useCourseFromUrl();
```

## Implementation Steps

### Phase 1: Create URL-Based Hook System ✅

- [x] Create `hooks/common/use-url-entity.ts`
- [x] Implement `useUrlEntities()` master hook
- [x] Implement specific hooks: `useCourseFromUrl()`, `useModuleFromUrl()`, etc.

### Phase 2: Migrate Components (In Progress)

- [x] Refactor `components/views/courses/course-card/course-card.tsx`
- [x] Refactor `components/forms/submission-form.tsx`
- [ ] Migrate remaining form components
- [ ] Migrate view components
- [ ] Update modal data passing

### Phase 3: Update Modal System

- [ ] Modify modals to accept entity data via props instead of global state
- [ ] Update `hooks/courses/use-course-modals.ts` to pass data directly
- [ ] Remove global state setters from modal hooks

### Phase 4: Clean Up Global State

- [ ] Remove unused "current entity" properties from app-store
- [ ] Keep only essential global state (`courses` array)
- [ ] Update remaining imports and dependencies

### Phase 5: Testing & Validation

- [ ] Test all navigation flows work correctly
- [ ] Verify SSR/hydration works properly  
- [ ] Ensure no broken functionality
- [ ] Performance testing for entity resolution

## File-by-File Migration Guide

### High Priority Files (Used in Multiple Places)

1. **`components/forms/submission-form.tsx`** ✅ COMPLETED
   - Replace `useAppStore()` with `useAssignmentFromUrl()`
   - Remove dependency on `currentCourse`, `currentAssignment`

2. **`components/forms/grade-submission-form.tsx`**
   - Replace `useAppStore()` with `useAssignmentFromUrl()` or direct props
   - Remove dependency on `currentCourse`, `currentSubmission`

3. **`components/views/courses/course-card/course-card.tsx`** ✅ COMPLETED
   - Remove `setCurrentCourse()` calls
   - Pass course data directly to modals

4. **`components/views/submissions/view-submissions.tsx`**
   - Replace global state with URL-based entities or props

5. **`hooks/courses/use-course-modals.ts`** (Critical)
   - Remove all `setCurrentX()` calls
   - Pass entity data directly to modal `data` property
   - Update modal opening patterns

### Medium Priority Files

6. **`components/views/assistant/study-assistant.tsx`**
7. **`components/views/lessons/lesson-view.tsx`**
8. **`components/views/courses/module-accordion/` components**
9. **Form components in `components/forms/`**

### Low Priority Files

10. Build artifacts and generated files (will be cleaned up automatically)

## Breaking Changes & Compatibility

### Modal System Changes

```typescript
// OLD: Modal reads from global state
const { currentCourse } = useAppStore();

// NEW: Modal receives data via props
openModal({
  id: 'edit-course',
  data: { course }  // Pass data directly
});
```

### Form Component Changes  

```typescript
// OLD: Form component reads global state
const { currentCourse, currentAssignment } = useAppStore();

// NEW: Form component uses URL or props
const { course, currentAssignment } = useAssignmentFromUrl();
// OR: Pass data as props from parent
```

## Benefits After Migration

1. **Better SSR/Hydration**: URL-based state works naturally with Next.js
2. **Easier Testing**: Components receive data via props/hooks, not global state  
3. **Better Performance**: Eliminates unnecessary global state subscriptions
4. **Cleaner Architecture**: Single source of truth (URL) for current entity context
5. **Better Developer Experience**: URL reflects application state accurately

## Rollback Plan

If issues arise:

1. Keep old `useAppStore` patterns alongside new ones temporarily
2. Gradually migrate back problematic components  
3. The `courses` array in global state remains untouched as fallback

## Success Metrics

- [ ] All TypeScript compilation errors resolved
- [ ] No broken navigation or modal functionality  
- [ ] SSR hydration warnings eliminated
- [ ] Reduced global state bundle size
- [ ] Improved component test isolation
- [ ] All URL routes properly reflect application state

## Timeline Estimate

- **Phase 1**: ✅ Complete (Hook system created)
- **Phase 2**: 4-6 hours (Component migration)  
- **Phase 3**: 2-3 hours (Modal system updates)
- **Phase 4**: 1-2 hours (Global state cleanup)
- **Phase 5**: 2-3 hours (Testing & validation)

**Total: 9-14 hours of development time**

---

*This migration will eliminate the architectural debt identified in the code audit and create a more maintainable, SSR-friendly application architecture.*
