const CONTEXT_MENU_TIMEOUT = 500;

let timer = null;

const startLongPressTimer = (e) => {
  clearLongPressTimer();
  timer = setTimeout(fireLongPressEvent.bind(null, e), CONTEXT_MENU_TIMEOUT);
};

const clearLongPressTimer = () => {
  clearTimeout(timer);
  timer = null;
};

const fireLongPressEvent = (originalEvent) => {
  clearLongPressTimer();

  const node = originalEvent.target;
  const x = originalEvent.touches[0].clientX;
  const y = originalEvent.touches[0].clientY;

  // This will emulate contextmenu mouse event
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });

  // fire the long-press event
  const suppressClickEvent = node.dispatchEvent.call(node, event);

  if (suppressClickEvent) {
    // temporarily intercept and clears the next click
    node.addEventListener(
      'touchend',
      function clearMouseUp(e) {
        node.removeEventListener('touchend', clearMouseUp);
        cancelEvent(e);
      },
      true
    );
  }
};

const cancelEvent = (e) => {
  e.stopImmediatePropagation();
  e.preventDefault();
  e.stopPropagation();
};

export default function contextmenu(node) {
  const isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  if (!isIos) return;

  // hook events that clear a pending long press event
  node.addEventListener('touchcancel', clearLongPressTimer);
  node.addEventListener('touchend', clearLongPressTimer);
  node.addEventListener('touchmove', clearLongPressTimer);

  // hook events that can trigger a long press event
  node.addEventListener('touchstart', startLongPressTimer);
}
