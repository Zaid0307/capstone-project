import { useCallback, useEffect, useRef, useState } from 'react';

// A list kept in a store (plans or workouts). Changes show immediately and are
// then saved; if saving fails, the list is reloaded and the failed action is
// remembered, so `retry` can run it again. When loading failed, `retry` loads
// the list again. The local store shows its data in the first render.
export default function useStoredList(store) {
  const [items, setItems] = useState(() => store.snapshot?.() ?? []);
  const [isLoading, setIsLoading] = useState(() => !store.snapshot);
  const [error, setError] = useState(null);
  const failedSave = useRef(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await store.list());
      return true;
    } catch (loadError) {
      setError(loadError);
      return false;
    }
  }, [store]);

  useEffect(() => {
    if (store.snapshot) return undefined;
    let isCurrent = true;
    store
      .list()
      .then(loaded => {
        if (isCurrent) setItems(loaded);
      })
      .catch(loadError => {
        if (isCurrent) setError(loadError);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [store]);

  const save = useCallback(
    async (change, request) => {
      setError(null);
      failedSave.current = null;
      setItems(change);
      try {
        await request();
      } catch (saveError) {
        failedSave.current = { change, request };
        setError(saveError);
        try {
          setItems(await store.list());
        } catch {
          // Still unreachable: keep the error shown, `retry` loads again.
        }
      }
    },
    [store]
  );

  const retry = useCallback(async () => {
    const failed = failedSave.current;
    if (!failed) return load();
    // Bring the list up to date first, then repeat the failed change on it.
    if (!(await load())) return false;
    await save(failed.change, failed.request);
    return failedSave.current === null;
  }, [load, save]);

  return { items, isLoading, error, save, retry };
}
