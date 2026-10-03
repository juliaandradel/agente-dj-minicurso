import '@testing-library/jest-dom/vitest'

// jsdom não implementa estes dois; os componentes com movimento dependem deles.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

if (!Element.prototype.animate) {
  Element.prototype.animate = (() => ({ cancel: () => {} })) as unknown as typeof Element.prototype.animate
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = (() => {}) as typeof Element.prototype.scrollTo
}
