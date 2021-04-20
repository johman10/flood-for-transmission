import App from '~components/App';

if (__ENV__ === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: window.location.pathname,
  });
}

new App({
  target: document.body,
});
