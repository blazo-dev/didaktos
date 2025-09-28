# Executive Summary

This report identifies unused code, dead code, redundant implementations, and files that may be candidates for removal or refactoring across the Didaktos frontend codebase. The analysis focuses on the frontend React/Next.js application after the recent global state refactoring.

**Key Findings:**

- 🚩 **Critical**: Entire `app-store.ts` global state is heavily used but may have unused "current entity" patterns
- 🟡 **Medium Priority**: Several utility hooks and validation systems are unused
- 🟠 **Low Priority**: Some modal components and helper functions need cleanup
- 🔵 **Experimental**: Advanced validation and loading utilities are implemented but unused

---

## 1. Unused Store Properties & Patterns

### `stores/app-store.ts`

**Status**: 🟡 **SOLUTION IN PROGRESS**

- **Issue**: Global "current entity" pattern that was partially refactored
- **Unused Properties**:
  - `currentCourse`, `setCurrentCourse` - Still used in ~18 files but may be redundant
  - `currentLesson`, `setCurrentLesson` - Used in lesson CRUD operations
  - `currentModule`, `setCurrentModule` - Used in modal management
  - `currentAssignment`, `setCurrentAssignment` - Used in assignment workflows
  - `currentSubmission`, `setCurrentSubmission` - Used for grading workflows
  - `currentSubmissions`, `setCurrentSubmissions` - Used for bulk operations
- **Solution**: ✅ **IMPLEMENTED** - Created `hooks/common/use-url-entity.ts` with URL-based entity resolution
- **Migration Status**:
  - ✅ Created URL-based hook system (`useUrlEntities`, `useCourseFromUrl`, etc.)
  - ✅ Migrated `course-card.tsx` to remove global state dependency
  - ✅ Migrated `submission-form.tsx` to use URL-based entities
  - 🔄 In progress: Modal system updates and remaining components
- **Next Steps**: See `.copilot/GLOBAL_STATE_MIGRATION_PLAN.md` for complete migration guide

---

## 2. Dead Code in Active Files

### `hooks/courses/use-course-modals.ts` - State Management Redundancy

**Status**: 🟠 **REDUNDANT PATTERN**

- **Lines 13-18**: Heavy usage of global "current entity" setters
- **Issue**: Sets global state for modal data that could be passed as props instead
- **Pattern**:

  ```typescript
  setCurrentModule(module);
  setCurrentLesson(lesson);  
  setCurrentAssignment(assignment);
  ```

- **Why Problematic**: Creates tight coupling between modals and global state
- **Suggested Action**: **REFACTOR** - Pass entity data directly to modals via props

### `hooks/assignments/use-assignment-actions.ts` - Temporary State

**Status**: 🟡 **TEMPORARY SOLUTION**

- **Lines 1-40**: Uses global state patterns that were marked for refactoring
- **Issue**: Temporary local state hook during architectural transition  
- **Suggested Action**: **CONSOLIDATE** - Integrate with new CRUD hook pattern

---

## 3. Redundant CRUD Implementations

### Legacy Individual CRUD Hooks

**Status**: 🟠 **SUPERSEDED BUT STILL USED**

- **Files**:
  - `hooks/modules/use-module-crud.ts` - Individual hooks vs factory pattern
  - `hooks/lessons/use-lesson-crud.ts` - Individual hooks vs factory pattern
  - `hooks/assignments/use-assignment-crud.ts` - Individual hooks vs factory pattern
- **Issue**: Old pattern coexists with new `createCrudHooks` factory
- **Suggested Action**: **MIGRATE** - Convert remaining files to use CRUD factory pattern

---

## 4. Experimental/Placeholder Code

### `lib/hooks/use-crud-hooks.ts` - Advanced Features

**Status**: 🔵 **ADVANCED FEATURES**

- **Lines 98-150**: `createNestedCrudHooks` function
- **Usage**: Used for course management but has unused advanced features
- **Suggested Action**: **KEEP** - Core functionality, advanced features may be needed
