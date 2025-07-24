import { useState, useEffect, useMemo, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import {
  AuthService,
  ProductService,
  SoftwareService,
  BlogService,
  CareerService,
  OrderService,
  UserService,
  ApiError,
} from '../services/api';
import {
  Product,
  SoftwareProduct,
  BlogPost,
  JobOpening,
  JobApplication,
  Order,
  User,
} from '../contexts/ContentContext';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface State<T> {
  data: T[];
  status: Status;
  error: ApiError | null;
}

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

// Overload signatures for type safety
function useOptimizedContent(type: 'products'): State<Product> & {
  save: (item: Product) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
function useOptimizedContent(type: 'software'): State<SoftwareProduct> & {
  save: (item: SoftwareProduct) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
function useOptimizedContent(type: 'blog'): State<BlogPost> & {
  save: (item: BlogPost) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
function useOptimizedContent(type: 'careers'): State<JobOpening> & {
  save: (item: JobOpening) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
function useOptimizedContent(type: 'orders'): State<Order> & {
  updateStatus: (id: string, newStatus: Order['status']) => Promise<void>;
};
function useOptimizedContent(type: 'users'): State<User> & {
  save: (item: User) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
function useOptimizedContent(type: 'applications'): State<JobApplication> & {
  save: (item: JobApplication) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: JobApplication['status']) => Promise<void>;
};

function useOptimizedContent<T extends { id: string }>(
  type: 'products' | 'software' | 'blog' | 'careers' | 'orders' | 'users' | 'applications',
  initialFetch = true
) {
  const [state, setState] = useState<State<T>>({ ...initialState, data: [] });

  const serviceMap = useMemo(() => ({
    products: ProductService,
    software: SoftwareService,
    blog: BlogService,
    careers: CareerService,
    orders: OrderService,
    users: UserService,
    applications: null, // No dedicated service for applications in this model
  }), []);

  const service = serviceMap[type];

  const fetchData = useCallback(async (cancelTokenSource?: CancelTokenSource) => {
    if (state.status === 'loading' || !service) return;
    setState(prevState => ({ ...prevState, status: 'loading', error: null }));

    try {
      const data = await service.getAll({ cancelToken: cancelTokenSource?.token });
      setState({ data: data || [], status: 'succeeded', error: null });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error(`Failed to fetch ${type}:`, error);
      setState({
        data: [],
        status: 'failed',
        error: error instanceof ApiError ? error : new ApiError('Failed to fetch data'),
      });
    }
  }, [service, type, state.status]);

  useEffect(() => {
    if (initialFetch) {
      const cancelTokenSource = axios.CancelToken.source();
      fetchData(cancelTokenSource);
      return () => cancelTokenSource.cancel('Component unmounted');
    }
  }, [initialFetch, fetchData]);

  const save = useCallback(async (item: T) => {
    if (!service) return;
    try {
      const isNew = !item.id || !state.data.find(d => d.id === item.id);
      const savedItem = isNew
        ? await service.create(item)
        : await service.update(item.id, item);

      if (!savedItem) throw new ApiError('Failed to save item: API returned null');

      setState(prevState => ({
        ...prevState,
        data: isNew
          ? [savedItem, ...prevState.data]
          : prevState.data.map(d => (d.id === savedItem.id ? savedItem : d)),
      }));
    } catch (error) {
      console.error(`Failed to save ${type}:`, error);
      throw error;
    }
  }, [service, type, state.data]);

  const remove = useCallback(async (id: string) => {
    if (!service) return;
    try {
      await service.delete(id);
      setState(prevState => ({
        ...prevState,
        data: prevState.data.filter(d => d.id !== id),
      }));
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      throw error;
    }
  }, [service, type]);

  const updateStatus = useCallback(async (id: string, newStatus: any) => {
    if (type === 'orders' || type === 'applications') {
      const typedService = service as typeof OrderService | null; // Or a new ApplicationService
      if (!typedService || !('updateStatus' in typedService)) return;

      try {
        const updatedItem = await typedService.updateStatus(id, newStatus);
        if (!updatedItem) throw new ApiError('Failed to update status: API returned null');

        setState(prevState => ({
          ...prevState,
          data: prevState.data.map(d => (d.id === id ? updatedItem : d)),
        }));
      } catch (error) {
        console.error(`Failed to update ${type} status:`, error);
        throw error;
      }
    }
  }, [service, type]);

  // Specific logic for applications (no service)
  const saveApplication = useCallback(async (application: JobApplication) => {
    const savedApplication = {
      ...application,
      id: application.id || `app-${Date.now()}`,
      submittedAt: application.submittedAt || new Date().toISOString(),
      status: application.status || 'pending',
    };
    const isNew = !application.id;
    setState(prevState => ({
      ...prevState,
      data: isNew
        ? [savedApplication, ...prevState.data]
        : prevState.data.map(a => (a.id === savedApplication.id ? savedApplication : a)),
    }));
  }, []);

  const removeApplication = useCallback(async (id: string) => {
    setState(prevState => ({
      ...prevState,
      data: prevState.data.filter(a => a.id !== id),
    }));
  }, []);

  const updateApplicationStatus = useCallback(async (id: string, status: JobApplication['status']) => {
    setState(prevState => ({
      ...prevState,
      data: prevState.data.map(a => (a.id === id ? { ...a, status } : a)),
    }));
  }, []);

  if (type === 'applications') {
    return {
      ...state,
      save: saveApplication,
      remove: removeApplication,
      updateStatus: updateApplicationStatus,
      fetchData, // Expose fetchData if manual refetch is needed
    };
  }

  return { ...state, save, remove, updateStatus, fetchData };
}

export default useOptimizedContent;
