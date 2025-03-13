import uiReducer, {
    setSearch,
    setStatusFilter,
    setPage,
    setLimit,
    resetFilters
  } from '@/lib/store/slices/uiSlice';
  import { TaskStatus } from '@/lib/types';
  
  describe('UI Slice', () => {
    const initialState = {
      filters: {
        search: '',
        status: '' as "" | TaskStatus,
        page: 1,
        limit: 10,
      },
    };
  
    it('should return the initial state', () => {
      expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('should handle setSearch', () => {
      const searchTerm = 'test search';
      const nextState = uiReducer(initialState, setSearch(searchTerm));
      expect(nextState.filters.search).toEqual(searchTerm);
      expect(nextState.filters.page).toEqual(1); // Page should reset to 1
    });
  
    it('should handle setStatusFilter', () => {
      const status = TaskStatus.COMPLETED;
      const nextState = uiReducer(initialState, setStatusFilter(status));
      expect(nextState.filters.status).toEqual(status);
      expect(nextState.filters.page).toEqual(1); // Page should reset to 1
    });
  
    it('should handle setPage', () => {
      const page = 2;
      const nextState = uiReducer(initialState, setPage(page));
      expect(nextState.filters.page).toEqual(page);
    });
  
    it('should handle setLimit', () => {
      const limit = 20;
      const nextState = uiReducer(initialState, setLimit(limit));
      expect(nextState.filters.limit).toEqual(limit);
      expect(nextState.filters.page).toEqual(1); // Page should reset to 1
    });
  
    it('should handle resetFilters', () => {
      const modifiedState = {
        filters: {
          search: 'test',
          status: TaskStatus.PENDING,
          page: 3,
          limit: 25,
        },
      };
  
      const nextState = uiReducer(modifiedState, resetFilters());
      expect(nextState).toEqual(initialState);
    });
  });