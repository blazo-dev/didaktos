import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OptimisticUpdate<T = any> {
  id: string;
  type: string;
  data: T;
  originalData?: T;
  timestamp: number;
  isReverted: boolean;
  isConfirmed: boolean;
}

interface OptimisticUpdateState {
  updates: Record<string, OptimisticUpdate>;
  
  // Actions
  addOptimisticUpdate: <T>(type: string, data: T, originalData?: T) => string;
  confirmUpdate: (updateId: string) => void;
  revertUpdate: (updateId: string) => void;
  clearUpdate: (updateId: string) => void;
  clearAllUpdates: () => void;
  
  // Selectors
  getActiveUpdates: () => OptimisticUpdate[];
  getUpdatesByType: (type: string) => OptimisticUpdate[];
  getPendingCount: () => number;
  hasActiveUpdates: boolean;
}

/**
 * Global optimistic update state management
 * Handles temporary UI updates while waiting for server confirmation
 */
export const useOptimisticUpdateStore = create<OptimisticUpdateState>()(
  devtools(
    (set, get) => ({
      updates: {},
      
      addOptimisticUpdate: (type, data, originalData) => {
        const updateId = `optimistic_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const update: OptimisticUpdate = {
          id: updateId,
          type,
          data,
          originalData,
          timestamp: Date.now(),
          isReverted: false,
          isConfirmed: false,
        };
        
        set((state) => ({
          updates: {
            ...state.updates,
            [updateId]: update,
          },
        }));
        
        // Auto-cleanup after 30 seconds if not confirmed/reverted
        setTimeout(() => {
          const currentUpdate = get().updates[updateId];
          if (currentUpdate && !currentUpdate.isConfirmed && !currentUpdate.isReverted) {
            get().revertUpdate(updateId);
          }
        }, 30000);
        
        return updateId;
      },
      
      confirmUpdate: (updateId) => {
        set((state) => ({
          updates: {
            ...state.updates,
            [updateId]: {
              ...state.updates[updateId],
              isConfirmed: true,
            },
          },
        }));
        
        // Clean up confirmed updates after 5 seconds
        setTimeout(() => {
          get().clearUpdate(updateId);
        }, 5000);
      },
      
      revertUpdate: (updateId) => {
        set((state) => ({
          updates: {
            ...state.updates,
            [updateId]: {
              ...state.updates[updateId],
              isReverted: true,
            },
          },
        }));
      },
      
      clearUpdate: (updateId) => {
        set((state) => {
          const { [updateId]: removed, ...rest } = state.updates;
          return { updates: rest };
        });
      },
      
      clearAllUpdates: () => {
        set({ updates: {} });
      },
      
      // Computed selectors
      getActiveUpdates: () => {
        return Object.values(get().updates).filter(
          (update) => !update.isReverted && !update.isConfirmed
        );
      },
      
      getUpdatesByType: (type) => {
        return Object.values(get().updates).filter(
          (update) => update.type === type && !update.isReverted && !update.isConfirmed
        );
      },
      
      getPendingCount: () => {
        return get().getActiveUpdates().length;
      },
      
      get hasActiveUpdates() {
        return get().getPendingCount() > 0;
      },
    }),
    { name: 'optimistic-updates' }
  )
);

/**
 * Hook for managing optimistic updates with automatic rollback
 * Provides convenient methods for common update patterns
 */
export function useOptimisticUpdates() {
  const store = useOptimisticUpdateStore();
  
  // Generic optimistic update with automatic confirmation/rollback
  const performOptimisticUpdate = async <T, R>(
    type: string,
    optimisticData: T,
    asyncOperation: () => Promise<R>,
    options: {
      originalData?: T;
      onSuccess?: (result: R, updateId: string) => void;
      onError?: (error: Error, updateId: string) => void;
      rollbackOnError?: boolean;
    } = {}
  ) => {
    const { rollbackOnError = true, onSuccess, onError } = options;
    
    // Start optimistic update
    const updateId = store.addOptimisticUpdate(type, optimisticData, options.originalData);
    
    try {
      // Perform async operation
      const result = await asyncOperation();
      
      // Confirm update on success
      store.confirmUpdate(updateId);
      onSuccess?.(result, updateId);
      
      return { result, updateId, success: true };
    } catch (error) {
      // Handle error
      if (rollbackOnError) {
        store.revertUpdate(updateId);
      }
      
      onError?.(error as Error, updateId);
      
      return { 
        error: error as Error, 
        updateId, 
        success: false,
        reverted: rollbackOnError 
      };
    }
  };
  
  // Specialized methods for common patterns
  const optimisticCreate = async <T>(
    type: string,
    newItem: T,
    createFn: () => Promise<T>
  ) => {
    return performOptimisticUpdate(
      `create_${type}`,
      newItem,
      createFn,
      {
        onSuccess: (result, updateId) => {
          console.log(`✅ Successfully created ${type}:`, result);
        },
        onError: (error, updateId) => {
          console.error(`❌ Failed to create ${type}:`, error);
        },
      }
    );
  };
  
  const optimisticUpdate = async <T>(
    type: string,
    itemId: string,
    updatedItem: T,
    originalItem: T,
    updateFn: () => Promise<T>
  ) => {
    return performOptimisticUpdate(
      `update_${type}_${itemId}`,
      updatedItem,
      updateFn,
      {
        originalData: originalItem,
        onSuccess: (result, updateId) => {
          console.log(`✅ Successfully updated ${type}:`, result);
        },
        onError: (error, updateId) => {
          console.error(`❌ Failed to update ${type}:`, error);
        },
      }
    );
  };
  
  const optimisticDelete = async <T>(
    type: string,
    itemId: string,
    originalItem: T,
    deleteFn: () => Promise<void>
  ) => {
    return performOptimisticUpdate(
      `delete_${type}_${itemId}`,
      null, // No data for delete
      deleteFn,
      {
        originalData: originalItem,
        onSuccess: (result, updateId) => {
          console.log(`✅ Successfully deleted ${type}`);
        },
        onError: (error, updateId) => {
          console.error(`❌ Failed to delete ${type}:`, error);
        },
      }
    );
  };
  
  // Batch operations
  const optimisticBatchUpdate = async <T>(
    type: string,
    updates: Array<{ id: string; data: T; original?: T }>,
    batchUpdateFn: () => Promise<T[]>
  ) => {
    const updateIds = updates.map(({ id, data, original }) =>
      store.addOptimisticUpdate(`batch_update_${type}_${id}`, data, original)
    );
    
    try {
      const results = await batchUpdateFn();
      
      // Confirm all updates
      updateIds.forEach(updateId => store.confirmUpdate(updateId));
      
      return { results, updateIds, success: true };
    } catch (error) {
      // Revert all updates on error
      updateIds.forEach(updateId => store.revertUpdate(updateId));
      
      return { 
        error: error as Error, 
        updateIds, 
        success: false,
        reverted: true 
      };
    }
  };
  
  return {
    // Core state
    activeUpdates: store.getActiveUpdates(),
    pendingCount: store.getPendingCount(),
    hasActiveUpdates: store.hasActiveUpdates,
    
    // Core methods
    performOptimisticUpdate,
    confirmUpdate: store.confirmUpdate,
    revertUpdate: store.revertUpdate,
    clearUpdate: store.clearUpdate,
    clearAllUpdates: store.clearAllUpdates,
    
    // Specialized methods
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    optimisticBatchUpdate,
    
    // Selectors
    getUpdatesByType: store.getUpdatesByType,
    isUpdatePending: (type: string) => store.getUpdatesByType(type).length > 0,
    
    // Status helpers
    getOptimisticItem: <T>(type: string, fallback?: T): T | undefined => {
      const updates = store.getUpdatesByType(type);
      return updates.length > 0 ? updates[0].data : fallback;
    },
    
    hasOptimisticChanges: (type: string) => store.getUpdatesByType(type).length > 0,
  };
}

/**
 * React hook that merges server data with optimistic updates
 * Usage: const data = useMergedData(serverData, 'course_updates');
 */
export function useMergedData<T>(
  serverData: T[],
  updateType: string,
  mergeKey: keyof T = 'id' as keyof T
) {
  const { getUpdatesByType } = useOptimisticUpdates();
  
  const optimisticUpdates = getUpdatesByType(updateType);
  
  // Merge server data with optimistic updates
  const mergedData = serverData.map((item) => {
    const optimisticUpdate = optimisticUpdates.find(
      (update) => update.data && update.data[mergeKey] === item[mergeKey]
    );
    
    return optimisticUpdate ? { ...item, ...optimisticUpdate.data } : item;
  });
  
  // Add any new optimistic items (creates)
  const newOptimisticItems = optimisticUpdates
    .filter((update) => 
      update.type.startsWith('create_') && 
      !serverData.some((item) => item[mergeKey] === update.data[mergeKey])
    )
    .map((update) => update.data);
  
  return [...mergedData, ...newOptimisticItems];
}