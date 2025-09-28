import { useApiMutation } from "./use-api-mutation";

/**
 * Configuration for creating CRUD hooks for an entity
 */
export interface CrudHookConfig<
    T,
    TCreateInput = Omit<T, "id">,
    TUpdateInput = Partial<T>
> {
    /** Entity name for success/error messages */
    entityName: string;
    /** Query keys to invalidate after mutations */
    invalidateKeys: string[];
    /** API methods for CRUD operations */
    api: {
        create?: (input: TCreateInput) => Promise<T>;
        update?: (id: string, input: TUpdateInput) => Promise<T>;
        delete?: (id: string) => Promise<void>;
    };
    /** Custom success messages */
    messages?: {
        createSuccess?: string;
        updateSuccess?: string;
        deleteSuccess?: string;
        createError?: string;
        updateError?: string;
        deleteError?: string;
    };
}

/**
 * Factory function to create standardized CRUD hooks
 */
export function createCrudHooks<
    T,
    TCreateInput = Omit<T, "id">,
    TUpdateInput = Partial<T>
>(config: CrudHookConfig<T, TCreateInput, TUpdateInput>) {
    const { entityName, invalidateKeys, api, messages = {} } = config;

    const useCreate = api.create
        ? () => {
              return useApiMutation(api.create!, {
                  successMessage:
                      messages.createSuccess ||
                      `${entityName} created successfully!`,
                  errorMessage:
                      messages.createError ||
                      `Failed to create ${entityName.toLowerCase()}. Please try again.`,
                  invalidateKeys,
              });
          }
        : undefined;

    const useUpdate = api.update
        ? () => {
              return useApiMutation(
                  ({ id, input }: { id: string; input: TUpdateInput }) =>
                      api.update!(id, input),
                  {
                      successMessage:
                          messages.updateSuccess ||
                          `${entityName} updated successfully!`,
                      errorMessage:
                          messages.updateError ||
                          `Failed to update ${entityName.toLowerCase()}. Please try again.`,
                      invalidateKeys,
                  }
              );
          }
        : undefined;

    const useDelete = api.delete
        ? () => {
              return useApiMutation(api.delete!, {
                  successMessage:
                      messages.deleteSuccess ||
                      `${entityName} deleted successfully!`,
                  errorMessage:
                      messages.deleteError ||
                      `Failed to delete ${entityName.toLowerCase()}. Please try again.`,
                  invalidateKeys,
              });
          }
        : undefined;

    return {
        useCreate,
        useUpdate,
        useDelete,
    };
}

/**
 * Configuration for creating CRUD hooks for nested entities
 */
export interface NestedCrudHookConfig<
    T,
    TCreateInput = Omit<T, "id">,
    TUpdateInput = Partial<T>
> {
    /** Entity name for success/error messages */
    entityName: string;
    /** Query keys to invalidate after mutations */
    invalidateKeys: string[];
    /** API methods for nested CRUD operations */
    api: {
        create?: (parentId: string, input: TCreateInput) => Promise<T>;
        update?: (id: string, input: TUpdateInput) => Promise<T>;
        delete?: (id: string) => Promise<void>;
    };
    /** Custom success messages */
    messages?: {
        createSuccess?: string;
        updateSuccess?: string;
        deleteSuccess?: string;
        createError?: string;
        updateError?: string;
        deleteError?: string;
    };
}

/**
 * Specialized factory for entity CRUD with parent relationships
 */
export function createNestedCrudHooks<
    T,
    TCreateInput = Omit<T, "id">,
    TUpdateInput = Partial<T>
>(config: NestedCrudHookConfig<T, TCreateInput, TUpdateInput>) {
    const { entityName, invalidateKeys, api, messages = {} } = config;

    const useCreate = api.create
        ? () => {
              return useApiMutation(
                  ({
                      parentId,
                      input,
                  }: {
                      parentId: string;
                      input: TCreateInput;
                  }) => api.create!(parentId, input),
                  {
                      successMessage:
                          messages.createSuccess ||
                          `${entityName} created successfully!`,
                      errorMessage:
                          messages.createError ||
                          `Failed to create ${entityName.toLowerCase()}. Please try again.`,
                      invalidateKeys,
                  }
              );
          }
        : undefined;

    const useUpdate = api.update
        ? () => {
              return useApiMutation(
                  ({ id, input }: { id: string; input: TUpdateInput }) =>
                      api.update!(id, input),
                  {
                      successMessage:
                          messages.updateSuccess ||
                          `${entityName} updated successfully!`,
                      errorMessage:
                          messages.updateError ||
                          `Failed to update ${entityName.toLowerCase()}. Please try again.`,
                      invalidateKeys,
                  }
              );
          }
        : undefined;

    const useDelete = api.delete
        ? () => {
              return useApiMutation(api.delete!, {
                  successMessage:
                      messages.deleteSuccess ||
                      `${entityName} deleted successfully!`,
                  errorMessage:
                      messages.deleteError ||
                      `Failed to delete ${entityName.toLowerCase()}. Please try again.`,
                  invalidateKeys,
              });
          }
        : undefined;

    return {
        useCreate,
        useUpdate,
        useDelete,
    };
}
