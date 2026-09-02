import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Prerendered pages ship real markup inside #root, so hydrate it rather than
 * throwing it away — a createRoot() render would blank the server HTML on load
 * and hand back the empty-shell behaviour prerendering exists to remove.
 */
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
