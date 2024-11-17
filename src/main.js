import { mount } from 'svelte';
import App from '~components/App';

if (__ENV__ === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: window.location.pathname,
  });
}

const app = mount(App, { target: document.body });
