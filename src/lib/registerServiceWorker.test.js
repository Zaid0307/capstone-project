import { registerServiceWorker } from './registerServiceWorker';

function fakeEnvironment() {
  const listeners = {};
  return {
    nav: { serviceWorker: { register: vi.fn(() => Promise.resolve({})) } },
    win: { addEventListener: (name, callback) => (listeners[name] = callback) },
    load: () => listeners.load?.(),
  };
}

describe('registerServiceWorker', () => {
  it('registers the worker after loading in the production build', () => {
    const env = fakeEnvironment();
    expect(registerServiceWorker({ isProduction: true, nav: env.nav, win: env.win })).toBe(true);
    env.load();
    expect(env.nav.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
  });

  it('does nothing during development or without support', () => {
    const env = fakeEnvironment();
    expect(registerServiceWorker({ isProduction: false, nav: env.nav, win: env.win })).toBe(false);
    expect(registerServiceWorker({ isProduction: true, nav: {}, win: env.win })).toBe(false);
    env.load();
    expect(env.nav.serviceWorker.register).not.toHaveBeenCalled();
  });
});
