import { lazy, useEffect, useState } from 'react';

// The exercise catalog (about 380 kB) is not part of the app start. It is loaded
// with import() where it is needed: exercise pages, plan editor, training and
// analyses. Code that runs before (plan model, migrations, today page) works
// without it; helpers in utils/workoutPlan.js read it through exerciseLibrary()
// and fall back to the stored text while it is still loading.
//
// exerciseLibrary.js registers itself when it is evaluated, so any module that
// imports it statically (and every test that does) also fills the holder.

let library = null;
let loading = null;

export function registerExerciseLibrary(module) {
  library = module;
}

// The loaded library (EXERCISES, exerciseById, …) or null while it is loading.
export const exerciseLibrary = () => library;

export function loadExerciseLibrary() {
  if (library) return Promise.resolve(library);
  loading ??= import('./exerciseLibrary').then(() => library);
  return loading;
}

// React.lazy for a page that needs the library: the page chunk and the library
// load in parallel, Suspense shows the usual loading state until both are there.
export function lazyWithExerciseLibrary(loadPage) {
  return lazy(() => Promise.all([loadPage(), loadExerciseLibrary()]).then(([page]) => page));
}

// The library for a component, null until it is loaded (then the component renders again).
export function useExerciseLibrary() {
  const [loaded, setLoaded] = useState(library);
  useEffect(() => {
    if (loaded) return undefined;
    let isCurrent = true;
    loadExerciseLibrary().then(module => {
      if (isCurrent) setLoaded(module);
    });
    return () => {
      isCurrent = false;
    };
  }, [loaded]);
  return loaded;
}

// Renders its children once the library is there, `fallback` until then.
export function WithExerciseLibrary({ children, fallback = null }) {
  const loaded = useExerciseLibrary();
  return loaded ? children : fallback;
}

// Starts loading in the background right after the app start, so the library is
// usually there before anyone opens a page that needs it.
export function preloadExerciseLibrary() {
  if (typeof window === 'undefined') return;
  const start = () => loadExerciseLibrary();
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 2000 });
  else window.setTimeout(start, 500);
}
