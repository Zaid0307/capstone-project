import { act, renderHook, waitFor } from '@testing-library/react';
import useStoredList from './useStoredList';

// A backend-like store whose requests can be made to fail.
function flakyStore(initial = []) {
  let items = [...initial];
  const store = {
    failCreate: false,
    failList: false,
    list: vi.fn(() => (store.failList ? Promise.reject(new TypeError('Failed to fetch')) : Promise.resolve([...items]))),
    create: vi.fn(item => {
      if (store.failCreate) return Promise.reject(new TypeError('Failed to fetch'));
      items = [...items, item];
      return Promise.resolve();
    }),
  };
  return store;
}

describe('useStoredList', () => {
  it('repeats the last failed save on retry', async () => {
    const store = flakyStore([{ id: 'a' }]);
    const { result } = renderHook(() => useStoredList(store));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    store.failCreate = true;
    const item = { id: 'b' };
    await act(() => result.current.save(current => [...current, item], () => store.create(item)));
    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.items).toEqual([{ id: 'a' }]);

    store.failCreate = false;
    let succeeded;
    await act(async () => {
      succeeded = await result.current.retry();
    });
    expect(succeeded).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.items).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(store.create).toHaveBeenCalledTimes(2);
  });

  it('keeps the error when the store is still unreachable', async () => {
    const store = flakyStore();
    const { result } = renderHook(() => useStoredList(store));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    store.failCreate = true;
    store.failList = true;
    const item = { id: 'b' };
    await act(() => result.current.save(current => [...current, item], () => store.create(item)));
    await act(async () => {
      expect(await result.current.retry()).toBe(false);
    });
    expect(result.current.error).toBeInstanceOf(TypeError);
  });

  it('loads again on retry when loading failed', async () => {
    const store = flakyStore([{ id: 'a' }]);
    store.failList = true;
    const { result } = renderHook(() => useStoredList(store));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    store.failList = false;
    await act(() => result.current.retry());
    expect(result.current.error).toBeNull();
    expect(result.current.items).toEqual([{ id: 'a' }]);
  });
});
