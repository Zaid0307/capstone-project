// Adds DOM matchers like toBeInTheDocument() to Vitest's expect.
import '@testing-library/jest-dom/vitest';
// The exercise catalog is loaded on demand in the app; tests have it from the start.
import './data/exerciseLibrary';
